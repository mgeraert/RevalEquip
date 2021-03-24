import fnmatch
import json
import os

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

files = Blueprint('files', __name__)

basedir = os.path.abspath(os.path.dirname(__file__))


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_EXTENSIONS']


@files.route('/uploadajax_eq', methods=['GET', 'POST'])
def upldfile_eq():
    equipment_id = request.args.get('equipment_id')
    if request.method == 'POST':
        files = request.files['file']
        if files and allowed_file(files.filename):
            filename = equipment_id + '-1' + secure_filename(files.filename)
            updir = os.path.join(basedir, 'static\\images\\upload\\')
            files.save(os.path.join(updir, filename))
            file_size = os.path.getsize(os.path.join(updir, filename))
            return jsonify(name=filename, size=file_size)


@files.route('/uploadajax_user', methods=['GET', 'POST'])
def upldfile_user():
    user_id = request.args.get('user_id')
    if request.method == 'POST':
        files = request.files['file']
        if files and allowed_file(files.filename):
            filename = '-1' + user_id + secure_filename(files.filename)
            updir = os.path.join(basedir, 'static\\images\\upload\\')
            files.save(os.path.join(updir, filename))
            file_size = os.path.getsize(os.path.join(updir, filename))
            return jsonify(name=filename, size=file_size)


@files.route('/get_files', methods=['GET'])
def get_files_from_directory():
    directory = request.args.get('directory')
    equipmentID = request.args.get('equipmentID')
    userID = request.args.get('userID')

    updir = os.path.join(basedir, directory)
    files = os.listdir(updir)
    images = []
    if userID == '-1':
        for file in files:
            if fnmatch.fnmatch(file, equipmentID + "-1*"):
                images.append(file)
    else:
        for file in files:
            if fnmatch.fnmatch(file, "-1" + userID + "*"):
                images.append(file)
    return json.dumps(images)
