# Sound Recorder

This is a partially complete sound recording application created in ReactJS.

This is, in many ways, a recreation of this [dictaphone web application](https://github.com/mdn/web-dictaphone/).

Use this repository as the starting point to fulfill the tasks below.

## How to run this project

- Installation: `yarn`
- Run the project: `yarn start`

## Tasks

### Add Graphic Design

Style the front end to look as close as possible to the image below. It does not 
need to be perfect but should be consistent and responsive.

#### Acceptance Criteria

- The background color is the same charcoal black as the image
- The title is the same bluegreen color as the image
- The selected track is highlighted so it stands out from the other tracks in 
the list
- There is a carot or other visual indicator that tells the user which track is 
currently playing or selected
- The buttons are clearly defined, large enough to be easily tapped by people 
with large fingers, and far enough apart that they won't accidentally be tapped.

![Sound Recorder Sample UI](https://user-images.githubusercontent.com/28703641/127174662-6e1d4e36-9d05-4f06-9590-2a5f9ecf24fa.jpeg)

### Store recordings list in "global" scope

Currently the list of recordings is saved in state in the Recorder component. As 
other parts of the system will need access to this list, move the state into a 
more accessible place using Redux, Context, or xstate, or similar.

### Add RecordingsList component

Currently the list of recordings is generated inside the Recorder component. This 
is a task to move that code into its own component called RecordingsList.

### Save recording to AWS or similar

Given a recording is in progress, when the user taps the stop button, then the audio 
is uploaded to AWS or similar.

Whenever the main screen loads, then the list of recordings is pulled from AWS 
and displayed.

Given a user is looking at the list of recordings, when the user taps the Delete 
button and the user confirms the deletion, then the audio is removed from AWS 
or similar.