app_name = "library_management"
app_title = "Library Management"
app_publisher = "Your Name"
app_description = "Simple Library Management System"
app_icon = "octicon octicon-book"
app_color = "blue"
app_email = "you@example.com"
app_license = "MIT"

# Include DocTypes in fixtures
fixtures = [
    "Custom Field",
    "Property Setter",
    "Role",
    "DocType",
]

# Scheduled Tasks
scheduler_events = {
    "daily": [
        "library_management.api.loan.send_overdue_notifications"
    ]
} 