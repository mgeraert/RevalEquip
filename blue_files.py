import json
import os

import flask_login
from flask import Blueprint, request, send_file, current_app
from flask_login import login_required
from werkzeug.utils import secure_filename

from classes.Database import Database

files = Blueprint('files', __name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_EXTENSIONS']


@files.route('/access-files/get-by-user-id', methods=['GET'])
@login_required
def get_access_files_by_user_id():
    user = flask_login.current_user
    if not user.is_admin():
        return '{}'

    db = Database()
    user_id = request.args.get('user_id')

    sql1 = 'SELECT document_name FROM documents WHERE user_id = "' + user_id + '" AND document_name LIKE ' \
                                                                               '"user_register_upload_%" '

    sql2 = 'SELECT picture_name FROM pictures WHERE user_id = "' + user_id + '" AND picture_name LIKE ' \
                                                                             '"user_register_upload_%" '
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql1)
    documents = c.fetchall()
    c.execute(sql2)
    pictures = c.fetchall()
    c.close()
    return json.dumps(documents + pictures)


@files.route('/access-files/user-document', methods=['GET'])
@login_required
def download_access_files_by_user_id():
    user = flask_login.current_user
    if not user.is_admin():
        return ''

    document = request.args.get('document')
    return send_file(os.getcwd() + '\\static\\docs\\upload\\' + document,
                     attachment_filename=document)


@files.route('/equipment-files/upload', methods=['GET', 'POST'])
@login_required
def upload_equipment_file():
    equipment_id = request.args.get('equipment_id')
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        file_type = filename.rsplit('.', 1)[-1]
        if files and allowed_file(file.filename):
            db = Database()
            c = db.conn.cursor()
            if file_type == 'png' or file_type == 'jpg' or file_type == 'jpeg' or file_type == 'gif':
                # prepare upload picture to files
                updir = os.path.join(os.getcwd(), 'static\\images\\upload\\')
                filename = 'equipment_picture_id_' + str(equipment_id) + '_filename_' + filename
                # prepare upload picture to pictures table in db
                sql_string = 'INSERT INTO pictures (picture_name, equipment_id) VALUES ("' + filename + '","' + equipment_id + '")'
            else:
                # prepare upload document to files
                updir = os.path.join(os.getcwd(), 'static\\docs\\upload\\')
                filename = 'equipment_document_id_' + str(equipment_id) + '_filename_' + filename
                # prepare upload document to documents table in db
                sql_string = 'INSERT INTO documents (document_name, equipment_id) VALUES ("' + filename + '","' + equipment_id + '")'

            c.execute(sql_string)
            db.conn.commit()
            file.save(os.path.join(updir, filename))
            file_size = os.path.getsize(os.path.join(updir, filename))
            json_string = '{"name": "' + filename + '", "size": "' + str(file_size) + '"}'
            return json.dumps(json_string)


@files.route('/equipment-files/get-pictures-by-equipment-id', methods=['GET'])
@login_required
def get_equipment_pictures_by_equipment_id():
    equipment_id = request.args.get('equipment_id')
    db = Database()
    sql = 'SELECT picture_name FROM pictures WHERE equipment_id = "' + str(equipment_id) + '" AND picture_name LIKE ' \
                                                                                           '"equipment_picture_%" '
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    pictures = json.dumps(c.fetchall())
    c.close()
    return pictures


@files.route('/equipment-files/get-documents-by-equipment-id', methods=['GET'])
@login_required
def get_equipment_documents_by_equipment_id():
    equipment_id = request.args.get('equipment_id')
    db = Database()
    sql = 'SELECT document_name FROM documents WHERE equipment_id = "' + str(equipment_id) + '" AND document_name ' \
                                                                                             'LIKE ' \
                                                                                             '"equipment_document_%" '
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    documents = json.dumps(c.fetchall())
    c.close()
    return documents


@files.route('/equipment-files/equipment-document', methods=['GET'])
@login_required
def download_equipment_document():
    document = request.args.get('document')
    return send_file(os.getcwd() + '\\static\\docs\\upload\\' + document,
                     attachment_filename=document)


@files.route('/users-files/upload', methods=['GET', 'POST'])
@login_required
def upload_user_profile_picture():
    user_id = request.args.get('user_id')
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        file_type = filename.rsplit('.', 1)[-1]
        if file_type == 'pdf' or file_type == 'txt':
            json_string = '{"error": "file not allowed"}'
            return json.dumps(json_string)
        if files and allowed_file(file.filename):
            db = Database()
            c = db.conn.cursor()

            # prepare upload picture to files
            updir = os.path.join(os.getcwd(), 'static\\images\\upload\\')
            filename = 'user_profile_picture_id_' + str(user_id) + '_filename_' + filename
            # delete previous profile picture
            sql_delete = 'DELETE FROM pictures WHERE user_id = "' + user_id + '" AND picture_name LIKE ' \
                                                                              '"user_profile_picture_id_%" '
            c.execute(sql_delete)

            pictures_dir = os.path.join(os.getcwd(), 'static\\images\\upload\\')
            for fname in os.listdir(pictures_dir):
                if fname.startswith("user_profile_picture_id_" + user_id):
                    os.remove(os.path.join(pictures_dir, fname))
            # prepare upload picture to pictures table in db
            sql_insert = 'INSERT INTO pictures (picture_name, user_id) VALUES ("' + filename + '","' + user_id + '") '
            c.execute(sql_insert)

            db.conn.commit()
            file.save(os.path.join(updir, filename))
            file_size = os.path.getsize(os.path.join(updir, filename))
            json_string = '{"name": "' + filename + '", "size": "' + str(file_size) + '"}'
            return json.dumps(json_string)


@files.route('/users-files/get-by-user-id', methods=['GET'])
@login_required
def get_profile_picture_by_user_id():
    user = flask_login.current_user
    if not user.is_admin():
        return '{}'

    db = Database()
    user_id = request.args.get('user_id')

    sql = 'SELECT picture_name FROM pictures WHERE user_id = "' + user_id + '" AND picture_name LIKE ' \
                                                                            '"user_profile_picture_id_%" '
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    picture = json.dumps(c.fetchall())
    c.close()
    return picture
