FROM python:3.7

WORKDIR /RevalEquip
COPY . /RevalEquip

RUN pip install -r requirements.txt

CMD ["python", "app.py"]