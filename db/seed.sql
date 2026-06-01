USE HelpDeskDb;

INSERT INTO Role (RoleName) VALUES
('Admin'),
('IT Support Agent'),
('Employee'),
('Manager');

INSERT INTO Department (DepartmentName) VALUES
('IT'),
('HR'),
('Finance'),
('Operations');

INSERT INTO Category (Name) VALUES
('Hardware'),
('Software'),
('Network'),
('Email'),
('Access Request'),
('Other');

INSERT INTO Priority (Name) VALUES
('Low'),
('Medium'),
('High'),
('Critical');

INSERT INTO Status (Name) VALUES
('Open'),
('In Progress'),
('Pending'),
('Resolved'),
('Closed');