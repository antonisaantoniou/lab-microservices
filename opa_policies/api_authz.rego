package httpapi.authz

# HTTP API request
import input

default allow = false

# Allow employees members to get anything.
allow {
  input.method == "GET"
  input.path = ["api", _ ]
  input.user == employees[_]
}

# Allow employees members to update anything.
allow {
  input.method == "PUT"
  input.path = ["api", _ ]
  input.user == employees[_]
}

# Allow employees members to create anything.
allow {
  input.method == "POST"
  input.path = ["api", _ ]
  input.user == employees[_]
}

# Allow only admin members to delete something.
allow {
  input.method == "DELETE"
  input.path = ["api", _ ]
  input.user == admins[_]
}

# Allow assign a driver to a car for employees.
allow {
  input.method == "PUT"
  input.path = ["api", "cars", _ , "driver" , _ ]
  input.user == employees[_]
}

# Allow delete for employees only for removing a driver from a car.
allow {
  input.method == "DELETE"
  input.path = ["api", "cars", _ , "driver" , _ ]
  input.user == employees[_]
}

# David is the only member of admin users.
admins = [
  "david",
]

# David is the only member of HR.
employees = [
  "david",
  "john",
]

