import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import nowdate

@frappe.whitelist(allow_guest=False)
def list_books():
    books = frappe.get_all("Book", fields=["name", "title", "author", "publish_date", "isbn", "status"])
    return books

@frappe.whitelist(allow_guest=False)
def get_book(name):
    book = frappe.get_doc("Book", name)
    return book.as_dict()

@frappe.whitelist(allow_guest=False, methods=["POST"])
def create_book(title, author, publish_date=None, isbn=None):
    doc = frappe.new_doc("Book")
    doc.title = title
    doc.author = author
    doc.publish_date = publish_date
    doc.isbn = isbn
    doc.insert()
    frappe.db.commit()
    return doc.as_dict()

@frappe.whitelist(allow_guest=False, methods=["PUT"])
def update_book(name, title=None, author=None, publish_date=None, isbn=None, status=None):
    doc = frappe.get_doc("Book", name)
    if title is not None:
        doc.title = title
    if author is not None:
        doc.author = author
    if publish_date is not None:
        doc.publish_date = publish_date
    if isbn is not None:
        doc.isbn = isbn
    if status is not None:
        doc.status = status
    doc.save()
    frappe.db.commit()
    return doc.as_dict()

@frappe.whitelist(allow_guest=False, methods=["DELETE"])
def delete_book(name):
    frappe.delete_doc("Book", name)
    frappe.db.commit()
    return {"message": _(f"Book {name} deleted")} 