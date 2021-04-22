import hashlib

from flask import Blueprint, render_template, request, url_for, flash
from werkzeug.utils import redirect

from classes.Database import Database

change_password = Blueprint('change_password', __name__)


@change_password.route("/change-password", methods=['GET'])
def _change_password():
    email_hash = request.args.get('email')
    if email_hash is None:
        return redirect(url_for('auth.login'))
    return render_template("change_password.html", email_hash=email_hash)


@change_password.route("/change-password", methods=['POST'])
def change_password_form():
    email_hash = request.form.get('email_hash')
    new_pw_hash = request.form.get('new_pw_hash')
    confirm_pw_hash = request.form.get('confirm_pw_hash')

    if new_pw_hash == "" or confirm_pw_hash == "":
        flash("Make sure that both passwords are the filled in.")
        return render_template("change_password.html", email_hash=email_hash)

    if new_pw_hash != confirm_pw_hash:
        flash("Make sure that both new passwords are the same.")
        return render_template("change_password.html", email_hash=email_hash)

    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT ID, user_email FROM users'
    c.execute(sql_string)
    data = c.fetchall()

    email = ''
    for user in data:
        user_email_hash = hashlib.sha256(user['user_email'].encode()).hexdigest()
        if user_email_hash == email_hash:
            email = user['user_email']

    sql1 = 'UPDATE users SET user_set_pw="1", user_pw_hash = "' + new_pw_hash + '" WHERE user_email = "' + email + '"'
    c.execute(sql1)
    db.conn.commit()
    c.close()

    flash("Passport successfully changed.")
    return redirect(url_for('auth.login'))


# @change_password.route("/change-password/reset", methods=['GET'])
# def change_password_from_reset():
#     email_hash = request.args.get('email')
#     if email_hash is None:
#         return render_template("reset_password.html")
#     return render_template("change_password.html", email_hash=email_hash)
