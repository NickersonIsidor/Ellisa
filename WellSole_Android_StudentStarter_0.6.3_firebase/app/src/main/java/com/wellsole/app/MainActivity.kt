
package com.wellsole.app
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.wellsole.app.ui.screens.*
import com.google.firebase.ktx.Firebase
import com.google.firebase.auth.ktx.auth

enum class AppStage { Onboarding, OnboardingComplete, Live, About }

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      MaterialTheme {
        var stage by remember { mutableStateOf(AppStage.Onboarding) }
        LaunchedEffect(Unit){
          if (Firebase.auth.currentUser == null) { Firebase.auth.signInAnonymously() }
        }
        Scaffold(topBar = { TopAppBar(title = { Text("WellSole") }, actions = {
          TextButton(onClick = { stage = AppStage.About }) { Text(text = getString(R.string.menu_about)) }
        }) }) { p ->
          Box(Modifier.padding(p).padding(16.dp)){
            when(stage){
              AppStage.Onboarding -> OnboardingScreen{ stage = AppStage.OnboardingComplete }
              AppStage.OnboardingComplete -> OnboardingCompleteScreen{ stage = AppStage.Live }
              AppStage.Live -> LiveScreen()
              AppStage.About -> AboutScreen{ stage = AppStage.Live }
            }
          }
        }
      }
    }
  }
}
