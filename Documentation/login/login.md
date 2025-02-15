# Login  (user stories)

1. [ ] Goto login screen (email) with login menu item 

## LoginMain

### Enter the email
1. [ ] enter the email
2. [ ] if the user is blocked, show notification (R)=> Home
3. [ ] continue to the next screen (OTP or PASSWORD)

## LoginOTP
1. [ ] enter the OTP code from email
2. [ ] OTP code is valid. Login as guest or authorized user (R)=> Dashboard
3. [ ] OTP code is invalid, attemps not execeeded. (R)=> Login[email] or Login[OTP]
4. [ ] OTP code is invalid, attemps execeeded. Valid user -> Block account (R)=> Home
5. [ ] OTP code is invalid, attemps execeeded. Guest -> (R)=> Login[email]

## LoginPassword
1. [ ] enter the password
2. [ ] password is valid, Login as authorized user (R)=> Dashboard
3. [ ] password is invalid, attemps not exceeded. Attemps updated (R)=> Login[password]
4. [ ] password is invalid, attemps exceeded. Account blocked (R)=> Dashboard

## stories

1. [ ] user with password
2. [ ] user with OTP
3. [ ] guest
