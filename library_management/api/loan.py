import frappe
from frappe import _
from frappe.utils import nowdate, add_days

@frappe.whitelist(allow_guest=False)
def list_loans():
    loans = frappe.get_all("Loan", fields=["name", "book", "member", "loan_date", "return_date", "returned", "overdue"])
    return loans

@frappe.whitelist(allow_guest=False)
def get_loan(name):
    loan = frappe.get_doc("Loan", name)
    return loan.as_dict()

@frappe.whitelist(allow_guest=False, methods=["POST"])
def create_loan(book, member, loan_date=None, return_date=None):
    # Check if book is available
    book_doc = frappe.get_doc("Book", book)
    if book_doc.status != "Available":
        frappe.throw(_("Book is not available for loan."))
    # Mark book as on loan
    book_doc.status = "On Loan"
    book_doc.save()
    # Create loan
    doc = frappe.new_doc("Loan")
    doc.book = book
    doc.member = member
    doc.loan_date = loan_date or nowdate()
    doc.return_date = return_date
    doc.returned = 0
    doc.overdue = 0
    doc.insert()
    frappe.db.commit()
    return doc.as_dict()

@frappe.whitelist(allow_guest=False, methods=["PUT"])
def return_loan(name):
    loan = frappe.get_doc("Loan", name)
    if loan.returned:
        frappe.throw(_("Loan already returned."))
    loan.returned = 1
    loan.save()
    # Mark book as available
    book_doc = frappe.get_doc("Book", loan.book)
    book_doc.status = "Available"
    book_doc.save()
    # Fulfill next reservation if any
    next_res = frappe.db.get_value("Reservation", {"book": loan.book, "fulfilled": 0}, "name")
    if next_res:
        res_doc = frappe.get_doc("Reservation", next_res)
        res_doc.fulfilled = 1
        res_doc.save()
        book_doc.status = "Reserved"
        book_doc.save()
    frappe.db.commit()
    return loan.as_dict()

@frappe.whitelist(allow_guest=False, methods=["DELETE"])
def delete_loan(name):
    frappe.delete_doc("Loan", name)
    frappe.db.commit()
    return {"message": _(f"Loan {name} deleted")}

@frappe.whitelist(allow_guest=False)
def report_books_on_loan():
    loans = frappe.get_all("Loan", filters={"returned": 0}, fields=["name", "book", "member", "loan_date", "return_date"])
    return loans

@frappe.whitelist(allow_guest=False)
def report_overdue_books():
    today = nowdate()
    loans = frappe.get_all("Loan", filters={"returned": 0, "overdue": 1}, fields=["name", "book", "member", "loan_date", "return_date"])
    return loans

def send_overdue_notifications():
    today = nowdate()
    overdue_loans = frappe.get_all("Loan", filters={"returned": 0, "overdue": 0}, fields=["name", "book", "member", "return_date"])
    for loan in overdue_loans:
        if loan["return_date"] and loan["return_date"] < today:
            doc = frappe.get_doc("Loan", loan["name"])
            doc.overdue = 1
            doc.save()
            member = frappe.get_doc("Member", doc.member)
            if member.email:
                frappe.sendmail(
                    recipients=[member.email],
                    subject="Library Book Overdue",
                    message=f"Your loan for book {doc.book} is overdue. Please return it as soon as possible."
                )
    frappe.db.commit() 