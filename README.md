# Food-Delivery
In this project, I will develop an Online Food Delivery Order Manager using HTML, CSS, and JavaScript. The application allows users to add, view, and manage food delivery orders through a simple and interactive interface.
FoodFlow – Online Food Delivery Order Manager
Project Overview

FoodFlow is a frontend-based web application developed using HTML, CSS, and JavaScript. The project is designed to manage online food delivery orders efficiently. It allows users to add new orders, view all existing orders, filter orders based on specific conditions, and automatically assign delivery to the nearest unpaid order. The application focuses on clean UI design, logical implementation, and real-world usability.

 Project Objective

The main objective of this project is to:

Build a functional food delivery order management system

Implement filtering and prioritization logic

Demonstrate frontend development skills using core web technologies

Create a deployable and user-friendly web application

Technology Stack

HTML5 – Structure and layout of the application

CSS3 – Styling, responsiveness, and UI design

JavaScript (Vanilla JS) – Application logic, filtering, and DOM manipulation

Font Awesome – Icons

Google Fonts (Poppins, Inter) – Typography

 Features

 Add new food delivery orders

 View all orders in a structured list

 Filter orders by:

Paid / Unpaid status

Maximum delivery distance

 Automatically assign delivery to the nearest unpaid order

 Display message when no suitable order is available

Basic input validation and error handling

 Responsive and user-friendly UI

 Data Model

Each food order contains the following fields:

orderId – Unique order identifier

restaurantName – Name of the restaurant

itemCount – Number of food items

isPaid – Payment status (true / false)

deliveryDistance – Distance in kilometers

 Assign Delivery Logic

Only unpaid orders are considered for delivery assignment

Orders are filtered based on the maximum distance entered by the user

The orders are sorted by delivery distance

The nearest unpaid order is automatically assigned

If no order matches the criteria, the system displays “No order available”
