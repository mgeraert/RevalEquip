import hashlib

from flask import Blueprint, render_template, request, url_for, flash
from werkzeug.utils import redirect

from classes import PasswordGenerator, MailServer
from classes.Database import Database

reset_password = Blueprint('reset_password', __name__)


@reset_password.route("/reset-password", methods=['GET'])
def _reset_password():
    return render_template("reset_password.html")


@reset_password.route("/reset-password", methods=['POST'])
def reset_password_form():
    user_email = request.form.get('reset_pw_email')

    if user_email == "":
        flash("Make sure you fill in your email.")
        return render_template("reset_password.html")

    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql = 'SELECT ID, user_is_allowed FROM users WHERE user_email = "' + user_email + '"'
    c.execute(sql)
    data = c.fetchall()
    c.close()
    if len(data) == 0:
        flash("Email has not been registered.")
        return render_template("reset_password.html")
    else:
        for user in data:
            if user['user_is_allowed'] == 0:
                flash("Account has not been allowed yet.")
                return render_template("reset_password.html")

    subject = 'REVAL: Reset your password'
    email_hash = hashlib.sha256(user_email.encode()).hexdigest()
    change_password_link = 'http://127.0.0.1:5000/change-password?email=' + email_hash
    content = '''Hello,
Follow this link to reset your Reval password for your account.
'''+change_password_link+'''
If you didn’t ask to reset your password, you can ignore this email.
Thanks,
Reval'''
    print(user_email, subject, content)
    MailServer.sendMail(user_email, subject, content)

    flash("Email to reset your password has been sent.")
    return redirect(url_for('auth.login'))
