import os
import platform
import sqlite3


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


class Database(object):
    def __init__(self):
        import configparser
        config = configparser.ConfigParser()
        current_os = platform.system().lower()

        if current_os.lower() == "windows":
            config.read(os.getcwd() + os.path.sep + 'revalConfig.ini')
            self.db_f_name = config['DEFAULT']['db_f_name']
            self.conn = sqlite3.connect(os.getcwd() + os.path.sep + self.db_f_name)
        else:
            config.read('/var/www/webApp/webApp/revalConfig.ini')
            self.db_f_name = config['DEFAULT']['db_f_name']
            self.conn = sqlite3.connect('/var/www/webApp/webApp/' + self.db_f_name)

    def create_table(self, table_name):
        c = self.conn.cursor()
        sql_string1 = 'CREATE TABLE IF NOT EXISTS ' \
                      + table_name \
                      + '(ID INTEGER PRIMARY KEY);'
        c.execute(sql_string1)
        return

    def insert_columns(self, table_name, columns):
        c = self.conn.cursor()
        for column in columns:
            sql_string = 'ALTER TABLE ' + table_name + '  ADD COLUMN ' + column + ';'
            try:
                c.execute(sql_string)
            except sqlite3.Error as e:
                if not 'duplicate column name:' in e.args[0]:
                    print(e.args[0])

    def get_sql_data(self, sql_string):
        self.conn.row_factory = dict_factory
        c = self.conn.cursor()
        c.execute(sql_string)
        return c.fetchall()

    def dict_factory(self, cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def create_users(self):
        table_name = 'users'
        self.create_table(table_name)

        columns = ["user_name TEXT DEFAULT ''",
                   "user_last_name TEXT",
                   "user_category TEXT",
                   "user_function TEXT DEFAULT ''",
                   "user_sex TEXT",
                   "user_email TEXT",
                   "user_telephone TEXT DEFAULT ''",
                   "user_title TEXT DEFAULT ''",
                   "user_home_address TEXT DEFAULT ''",
                   "user_private_phone TEXT DEFAULT ''",
                   "user_is_pi NUMBER DEFAULT -1",
                   "user_is_phd NUMBER DEFAULT -1",
                   "user_in_date DATE DEFAULT -1",
                   "user_out_date DATE DEFAULT -1",

                   "user_alternative_ID INTEGER DEFAULT -1",
                   "user_pw_hash TEXT DEFAULT ''",

                   "user_is_allowed NUMBER DEFAULT 0",
                   "user_date_when_allowed DATE DEFAULT -1",
                   "user_completed_profile NUMBER DEFAULT 0",
                   "user_set_pw NUMBER DEFAULT 0",

                   "user_is_financial_team NUMBER DEFAULT 0",
                   "user_is_admin NUMBER DEFAULT 0",
                   "user_is_lender NUMBER DEFAULT 1",
                   "user_is_lender_admin NUMBER DEFAULT 0",
                   "user_is_owner NUMBER DEFAULT 0"]

        self.insert_columns(table_name, columns)

    def create_equipment(self):
        table_name = 'equipment'
        self.create_table(table_name)

        columns = ["equipment_inventory_number TEXT DEFAULT ''",
                   "equipment_label TEXT DEFAULT ''",

                   "equipment_name TEXT DEFAULT ''",
                   "equipment_amount NUMBER DEFAULT 1",

                   "equipment_description TEXT DEFAULT ''",
                   "equipment_outcome TEXT DEFAULT ''",

                   "equipment_purchase_date DATE",
                   "equipment_purchase_price NUMBER",

                   "equipment_annual_cost NUMBER",
                   "equipment_annual_cost_budget TEXT DEFAULT ''",

                   "equipment_base_location TEXT DEFAULT ''",
                   "equipment_is_mobile NUMBER",
                   "equipment_bookable NUMBER DEFAULT 1",

                   "equipment_owner_id NUMBER DEFAULT -1",
                   "equipment_co_owner_id NUMBER DEFAULT -1",
                   "equipment_supplier_id NUMBER DEFAULT -1"]

        self.insert_columns(table_name, columns)

    def create_suppliers(self):
        table_name = 'suppliers'
        self.create_table(table_name)

        columns = ["supplier_last_name TEXT DEFAULT ''",
                   "supplier_name TEXT DEFAULT ''",
                   "supplier_email TEXT DEFAULT ''",
                   "supplier_phone TEXT DEFAULT ''",
                   "supplier_company TEXT DEFAULT ''",
                   "supplier_comment TEXT DEFAULT ''"]

        self.insert_columns(table_name, columns)

    def create_pictures(self):
        table_name = 'pictures'
        self.create_table(table_name)

        columns = ["picture_name TEXT DEFAULT ''",
                   "user_id NUMBER DEFAULT -1",
                   "equipment_id NUMBER DEFAULT -1"]

        self.insert_columns(table_name, columns)

    def create_documents(self):
        table_name = 'documents'
        self.create_table(table_name)

        columns = ["document_name TEXT DEFAULT ''",
                   "user_id NUMBER DEFAULT -1",
                   "equipment_id NUMBER DEFAULT -1"]

        self.insert_columns(table_name, columns)

    def create_db(self):
        self.create_users()
        self.create_equipment()
        self.create_suppliers()
        self.create_pictures()
        self.create_documents()
