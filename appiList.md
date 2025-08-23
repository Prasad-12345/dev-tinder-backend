# devTinder api's

authRouter
post /signUp
post /login
post /logout

profileRouter
get /profile/view
patch /profile/edit
patch /profile/password

connectionRequestRouter
<!-- post /request/send/interested/:userId
post /request/send/ignored/:userId -->
post /request/send/:status/:userId
<!-- post /request/review/accepted/:requestId
post /request/review/rejected/:requestId -->
post /request/send/:status/:requestId

status => interested, ignored, accepted, rejected

userRouter
get /user/connections
get /user/requests/received
get /user/feed - get profile of other users on platform
