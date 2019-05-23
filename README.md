# simple_PubSub
Step 1.
using Publisher Subscriber model with library AmplifyJS

Step 2.
Could not get AmplifyJS working, so switched to another library
for the Publisher Subscriber model: PubSub.
Performed simple test to see if PubSub is working.

Step 3.
Simple PubSub with:
- one publisher (the Runner class that publishes data whenever an athlete passes the line
start/finish line)
- one Subcriber (a display that processes the receiced data an then displays it).

The subscriber calcultes:
  - the last lap time of an athlete that passes the start/finish line
  - the total time since the start of an athlete that passes the start/finish line

Step 4.
Create a second subscriber, which displays the results of the match in this format:

Athlete name        Time  Gap
1. Nijel Amos       888   0
2. Adam Kszczot     890   2
3. Cornelius Tuwei  893   5
etc... 

How to implement step 4:
 - Save the start time of each athlete
 - Keep track of the number of laps for each athlete
 - Race ends at 2 laps. When first athlete reaches 2 laps, save its finish time,
 to calculate the gaps of the other athletes.