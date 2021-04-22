import random
from tkinter import *
import string

# ZTKdusDrbD?7*pLh

def generate_password():
    password = []
    for i in range(5):
        alpha = random.choice(string.ascii_letters)
        symbol = random.choice(string.punctuation)
        numbers = random.choice(string.digits)
        password.append(alpha)
        password.append(symbol)
        password.append(numbers)

    y = "".join(str(x) for x in password)
    return y