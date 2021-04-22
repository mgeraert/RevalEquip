import hashlib
import os
from datetime import datetime

import flask_login
from flask import Blueprint, render_template, request
from flask_login import login_required
from werkzeug.utils import redirect

from classes import MailServer
from classes.Database import Database

access_management = Blueprint('access_management', __name__)


@access_management.route("/access-management")
@login_required
def _access_management():
    user = flask_login.current_user
    if user.is_admin():
        return render_template("access_management.html")
    else:
        return redirect(request.referrer)


@access_management.route('/access-management/allow', methods=['GET'])
@login_required
def allow_access():
    user = flask_login.current_user
    # only admin is allowed to do this
    if not user.is_admin():
        return 'http403'

    db = Database()
    user_id = request.args.get('user_id')
    user_email = request.args.get('user_email')
    email_hash = hashlib.sha256(user_email.encode()).hexdigest()

    sql1 = 'UPDATE users SET user_date_when_allowed="' + datetime.today().strftime(
        '%d/%m/%Y') + '", user_is_allowed = 1  WHERE ID = "' + user_id + '"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql1)
    db.conn.commit()
    c.close()

    # sent email to user with temporary password so he can access the db after he changes his profile
    set_password_link = 'http://127.0.0.1:5000/change-password?email=' + email_hash
    subject = 'REVAL: You have been allowed! Setup your profile!'

    content = '''Hello,
You have been allowed to the Reval Database.
Please set up your profile, follow the link to set up your passport!
''' + set_password_link + '''

Thanks,
Reval'''

    print(user_email, subject, content)
    MailServer.sendMail(user_email, subject, content)

    return 'http200'


@access_management.route('/access-management/deny', methods=['GET'])
@login_required
def deny_access():
    user = flask_login.current_user
    # only admin is allowed to do this
    if not user.is_admin():
        return 'http403'

    db = Database()
    user_id = request.args.get('user_id')

    sql1 = 'DELETE FROM users WHERE ID = "' + user_id + '"'
    sql2 = 'DELETE FROM documents WHERE user_id = "' + user_id + '"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql1)
    c.execute(sql2)
    db.conn.commit()

    directory = 'static\\docs\\upload\\'
    my_dir = os.path.join(os.getcwd(), directory)
    for filename in os.listdir(my_dir):
        if filename.startswith("user_register_upload_id_" + user_id):
            os.remove(os.path.join(my_dir, filename))

    directory = 'static\\images\\upload\\'
    my_dir = os.path.join(os.getcwd(), directory)
    for filename in os.listdir(my_dir):
        if filename.startswith("user_register_upload_id_" + user_id):
            os.remove(os.path.join(my_dir, filename))

    c.close()

    # sent email to user that he got denied access to the db
    return 'http200'
