import frappe
from frappe import _
from frappe.utils import nowdate

@frappe.whitelist(allow_guest=False)
def list_reservations():
    reservations = frappe.get_all("Reservation", fields=["name", "book", "member", "reservation_date", "fulfilled"])
    return reservations

@frappe.whitelist(allow_guest=False)
def get_reservation(name):
    reservation = frappe.get_doc("Reservation", name)
    return reservation.as_dict()

@frappe.whitelist(allow_guest=False, methods=["POST"])
def create_reservation(book, member, reservation_date=None):
    # Only allow reservation if book is not available
    book_doc = frappe.get_doc("Book", book)
    if book_doc.status == "Available":
        frappe.throw(_("Book is available. No need to reserve."))
    # Check if already reserved by this member
    exists = frappe.db.exists("Reservation", {"book": book, "member": member, "fulfilled": 0})
    if exists:
        frappe.throw(_("You have already reserved this book."))
    doc = frappe.new_doc("Reservation")
    doc.book = book
    doc.member = member
    doc.reservation_date = reservation_date or nowdate()
    doc.fulfilled = 0
    doc.insert()
    frappe.db.commit()
    return doc.as_dict()

@frappe.whitelist(allow_guest=False, methods=["PUT"])
def fulfill_reservation(name):
    res = frappe.get_doc("Reservation", name)
    if res.fulfilled:
        frappe.throw(_("Reservation already fulfilled."))
    res.fulfilled = 1
    res.save()
    frappe.db.commit()
    return res.as_dict()

@frappe.whitelist(allow_guest=False, methods=["DELETE"])
def delete_reservation(name):
    frappe.delete_doc("Reservation", name)
    frappe.db.commit()
    return {"message": _(f"Reservation {name} deleted")} 