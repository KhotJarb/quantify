# /public/icons — PWA Icon Assets

Drop your exported PNG icons into this folder. Required files:

| File                    | Size      | Purpose                                          |
|-------------------------|-----------|--------------------------------------------------|
| icon-192.png            | 192×192   | Android Chrome launcher (standard)               |
| icon-512.png            | 512×512   | Android splash screen / Play Store               |
| icon-192-maskable.png   | 192×192   | Android Adaptive Icon (logo inset to 80% zone)   |
| icon-512-maskable.png   | 512×512   | Android Adaptive Icon large (logo inset to 80%)  |

## Maskable Icon Safe Zone
For maskable icons the **inner 80% of the canvas is the "safe zone"**.
Your logo should be no larger than 154×154px on a 192px canvas,
and 410×410px on a 512px canvas. Keep a solid background fill
(#1f1d19 recommended — matches app dark background).

Use https://maskable.app/editor to preview how Android will clip your icon.
