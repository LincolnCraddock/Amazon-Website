# Amazon-Website
Created with CodeSandbox.

## Run
Check out the website [here](https://m9kmc5-5000.csb.app).

## Features
Do you like buying AI generated slop? Using our tool, you can search for slop, filter by the category of slop, and then add the slop to cart. Other features include:
- Authenticated user registration and login
- Persistent storage of your cart on your local device
- Reduced stock when you make a purchase
- 100% fully AI generated products!

## Contributions
Lincoln:
basic header UI,
user registration/login back & front end,
search bar in the dashboard,
fixing things,
rubber ducky

James:
search and animation for searching,
also worked on user registration (i wrote the original server.js and user.js),
to note: evan and lincoln both added to server.js,
order confirmation,
cleaned up project structure (moving most js files into the script folder and removing any unused files),
a lot backend testing and bug fixes,

Evan:
Other:
A decent bit of mongoose prototyping,
Rubber ducky,
Testing,
Thought of "Slop Shop" lol,
Backend:
Refactored our model and mongoose related things which fixed the user registration/login not working,
Added mongoose and route handling of orders,
Added mongoose handling of stock information,
Added order-related adjustment of stock info in server memory (with those changes back-written to the mongodb),
Created route for the product json so that it retrieves the info as it exists in server memory instead of the static json.,
Worked with Lincoln on the order history route,
Frontend:
Added logic to various "add to cart" buttons to prevent exceeding stock.,
Minor tweaks to text, added appropriate decimal precision for prices in a couple places.,
Filled in stuff for the order history part of the dashboard.

Calvin:

Tanner:
Filtering feature js /integrated with searching
Contributed to allitems.js
Contributed to product.js
Cart UI
Cart JS
Dashboard UI
Dashboard JS
Contributed to login/register dropdown UI
Contributed to home page style/layout
Contributed to navbar/header design
Contributed to overall layout/style/UI of website

## Authors
- Evan Magill
- James Liranzo
- Tanner Pobursky
- Calvin Becker
- Lincoln Craddock
