# Login

## LoginMain

### Enter the email

01. [ ] Load User with this email
02. [ ] If user is not found, show notification
03. [ ] Cancel the login from here
04. [ ] Retry the login process
05. [ ] Use OTP
06. [ ] If user is found
07. [ ] If user is blocked -> Notification -> /dashboard
08. [ ] user is passwordless
09. [ ] >>>>> Generate OTP
10. [ ] >>>>> Send Email with OTP
11. [ ] >>>>> Create OTP entry in DB
12. [ ] >>>>> Create Task for this OTP
13. [ ] >>>>> Redirect to LoginOTP (with OTP id)
14. [ ] user has password
15. [ ] >>>>> Redirect to LoginPassword (with userId)

## LoginOTP

15. [ ] Enter OTP code and login
16. [ ] Load OTP From DB
17. [ ] Check if value entered is valid 
18. [ ] >>> Invalid -> add an attemp
19. [ ] >>>>> # attemps exceeded -> Notification
20. [ ] >>>>>>> Cancel: back to dashboard
21. [ ] >>>>>>> Retry : back to login screen
22. [ ] >>>>> # attemps not exceeded -> Notification
23. [ ] >>>>>>> update attemps in OTP
24. [ ] >>>>>>>>> Cancel -> Notification -> /dashboard
25. [ ] >>>>>>>>> OTP -> Notification -> /login/OTP
26. [ ] >>>>>>>>> Login -> Notification -> /Login/main
27. [ ] >>> Valid code: Exist user id
28. [ ] >>>>> NO: set user as guest (email): UserType with only email present (firstname = guest) => dashboard
29. [ ] >>>>> YES: load user information
30. [ ] >>>>>>> User Not Found : is normally impossible -> console log
31. [ ] >>>>>>> User Found : set User as logged in => dashboard

## LoginPassword

32. [ ] Enter password and login
33. [ ] Load User Information from DB
34. [ ] Check if password entered is valid
35. [ ] >>> Valid -> set User as logged in => dashboard
36. [ ] >>> Invalid -> add an attemp
37. [ ] >>>>> # attemps exceeded -> Notification user blocked
38. [ ] >>>>> # attemps not exceeded -> Notification
39. [ ] >>>>> Cancel -> /dashboard
40. [ ] >>>>> Retry -> /Login/Password
