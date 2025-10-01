
# Firebase Setup (WellSole v0.6.3)

1) Create a Firebase project and add an **Android app** with package `com.wellsole.app`.
2) Download **google-services.json** and replace `/app/google-services.json` (placeholder).
3) Enable:
   - **Authentication**: Anonymous (plus email/Google if desired)
   - **Firestore**: Production mode
   - **Storage**
   - **Remote Config**: keys `heatmap_sigma`=0.16, `heatmap_alpha`=0.40
4) Build & run. App signs in anonymously and fetches Remote Config. Values are shown on the Live screen.

See Developer Brief for data model and rules suggestions.
