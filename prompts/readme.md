Make a README.md: what the project is, how to install it, and the one command that runs all the tests.

FE: react and TS using vite and playwright

BE: Python and fast api using pytest



Project proposal below

\--

# CS 690 - Yappify 

**1. Problem and Target User**

We are building a short-form audio sharing platform similar to TikTok, where users browse and post short audio clips, instead of mostly videos. The primary target users are students between the ages of 13 and 25 who are avid consumers of short form social media content and looking for a quick way to discover, share and engage with audio-based content such as music clips, jokes, stories, reactions and other short recordings.



**2. Scope**

1. **Users can upload and publish short audio clips.**\
   A user can select or record an audio file, add a caption, tags, and  and publish it so that it appears in the app.\
   **Check:** Perform a manual test by uploading an audio file and confirming that it is saved correctly and can be played after refreshing or restarting the application.
2. **Users can browse a feed of audio posts.**\
   A user can scroll through a list of taggedfeed and play audio clips posted by other users, moving from one post to the next in a short-form content format.\
   **Check:** Test that multiple uploaded posts appear in the feed and that each audio file can be played without opening a separate page.
3. **Users can like and unlike audio posts.**\
   A user can like a post, see the like count update and remove their like later.\
   **Check:** Use an automated or manual test to confirm that the like count changes correctly and remains accurate after refreshing the application.
4. **Users can comment on audio posts.**\
   A user can add a text comment to an audio post and view comments left by other users.\
   **Check:** Post a comment, refresh the application and confirm that the comment remains attached to the correct audio post.
5. **Users can follow other users and view their posted audio.**\
   A user can follow another account and visit that user's profile to see the audio clips they have published.\
   **Check:** Follow a test account, confirm that the follow relationship is saved and verify that the account's published audio appears on its profile.

External Service: 

- Auth service 
- Cloud infrastructure / hosting
- Transcription models
- Github

**3. Non-goals and cut line**

1. **No Advanced Recommendation System**



2. **No Direct Messaging System between users**



3. **No Live Audio/Streaming service**

**Cut Line**

1. **Cut comment on audio posts.**
   1. **Cost is prohibitively expensive**
   2. **We are behind on our core goals by early November&#xA0;**

**4. Success measures**



1. Users must reliably be able to load the next audio clip in the list in under a second. 
   1. An audio clip takes noticeably longer than one second to load.
2. Once deployed, the application will have at least a 90% uptime.



**5. Why this is the right size**

**Check 1:&#x20;**&#x50;erform a manual test by uploading an audio file and confirming that it is saved correctly and can be played after refreshing or restarting the application.

- The main rule of the system is that years can only interact with audio posts through actions like uploading playing audios, liking, commenting and following.



**Check 2:&#x20;**&#x54;est that multiple uploaded posts appear in the feed and that each audio file can be played without opening a separate page.

- Given multiple audio posts have already been uploaded to the system
- When the user opens or scrolls through the feed
- Then the uploaded posts should appear in the feed and each audio file should play directly from the feed without opening a separate page 



**Check 3:&#x20;**&#x55;se an automated or manual test to confirm that the like count changes correctly and remains accurate after refreshing the application.

- Given the automated tests are executed
- When the test runs and presses the like button
- Then it passes when the like count goes up by one, and fails when it does not.



**Check 4:&#x20;**&#x50;ost a comment, refresh the application and confirm that the comment remains attached to the correct audio post

- Given the user is in the application and listening to a clip
- When the users leave a comment on the clip
- Then the correct comment persists on the clip - even after closing and re-opening the app



**Check 5:&#x20;**&#x46;ollow a test account, confirm that the following relationship is saved and verify that the account's published audio appears on its profile.

- Given a user is in the applications and can see another users profile 
- When the authenticated user follows the other user
- Then the audio from the user they follow is viewable on the profile





**Appendix A. Team, Roles, and Meeting Record**

| **Name**          | **UCID** | **Role** | **Role Description**                           |
| ----------------- | -------- | -------- | ---------------------------------------------- |
| **Joshua George** | jg826    | Backend  | API, Accepting Auth                            |
| **Ben Shuster**   | bzs6     | Frontend | Interface Design, SEO, Accessibility, Mockup   |
| **Luke Hill**     | lh325    | DevOps   | CI/CD, Automated Deployment, Quality assurance |



**Appendix B. Stakeholders**



| <br>       | Low Interest            | High Interest    |
| ---------- | ----------------------- | ---------------- |
| High Power | External Audio creators | Development Team |
| Low Power  | Parents of students     | Students         |



Primary Stakeholder - Students 

- Low Power / High Interest because they use the app directly and care a lot about the experiences but they do not control how the system is built 



Secondary Stakeholder - Development Team

- High Power / High interest because they manage, maintain and make decision about the application  



Tertiary Stakeholder - External Audio creators (Creators whose audios may appear on the app)

- High power / Low Interest because they may not use the app directly but they can influence how copyrighted audio is handled.



Easy to miss Stakeholder - Parents of student users

- Parents may not directly use the application but they may still have concerns about what their children are exposed to or share on the platform like any other social media platform.

**Appendix C. Interview Questions**





1. Describe the last time you tried to find an audio clip. 
2. What is your preferred method (audio, video, game, etc) of consuming content? Why? 
3. Tell us about some of the most used apps and sites you use. Why do you use them? 
4. What did you do the last time you wanted to share a short audio clip with a friend? Was it a good experience? 
5. Do you have a preferred length for the content you consume? Why? 



**Bad** **question**: 

Would you use an app that plays short audio clips?

**Rules Broke**

1. It asks about the future
2. It pitches the idea

**Better version:&#xA0;**

Have you ever listened to short audio or video clips? How was it?