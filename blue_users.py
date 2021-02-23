from flask import Blueprint, request, render_template

users = Blueprint('users', __name__)


@users.route('/getUsers', methods=['GET'])
def get_users():
    user_id = request.args.get('user_id')
    return user_id
