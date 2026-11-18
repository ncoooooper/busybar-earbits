# Firmware verification

BUSY Bar Emulator 0.1.0-beta.5, firmware 1.3.1.

Tested replay, wheel selection, grading and progression to a different question. Firmware logged two one-second PCM assets and a replay of the first. Back exited cleanly (71.5 KiB peak).

The app was typechecked, built, installed and exercised on the emulator. Native captures are under screenshots/. The tested installable archive is in packages/.

Firmware motion pass: start, up, ok. 16 distinct frames in the controls recording. App io.ncoooooper.earbits exited: finished; heap peak 82.3 of 128 KiB.
