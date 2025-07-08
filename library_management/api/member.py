import frappe
from frappe import _

@frappe.whitelist(allow_guest=False)
def list_members():
    members = frappe.get_all("Member", fields=["name", "membership_id", "email", "phone", "user"])
    return members

@frappe.whitelist(allow_guest=False)
def get_member(name):
    member = frappe.get_doc("Member", name)
    return member.as_dict()

@frappe.whitelist(allow_guest=False, methods=["POST"])
def create_member(name, membership_id, email, phone=None, user=None):
    doc = frappe.new_doc("Member")
    doc.name = name
    doc.membership_id = membership_id
    doc.email = email
    doc.phone = phone
    doc.user = user
    doc.insert()
    frappe.db.commit()
    return doc.as_dict()

@frappe.whitelist(allow_guest=False, methods=["PUT"])
def update_member(name, membership_id=None, email=None, phone=None, user=None):
    doc = frappe.get_doc("Member", name)
    if membership_id is not None:
        doc.membership_id = membership_id
    if email is not None:
        doc.email = email
    if phone is not None:
        doc.phone = phone
    if user is not None:
        doc.user = user
    doc.save()
    frappe.db.commit()
    return doc.as_dict()

@frappe.whitelist(allow_guest=False, methods=["DELETE"])
def delete_member(name):
    frappe.delete_doc("Member", name)
    frappe.db.commit()
    return {"message": _(f"Member {name} deleted")} 