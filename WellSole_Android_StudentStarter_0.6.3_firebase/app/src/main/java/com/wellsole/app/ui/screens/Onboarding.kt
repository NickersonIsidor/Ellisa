
package com.wellsole.app.ui.screens
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun OnboardingScreen(onFinish: ()->Unit){
  Column(
    modifier = Modifier.fillMaxSize().padding(24.dp),
    verticalArrangement = Arrangement.SpaceBetween
  ){
    Column {
      Text("Welcome to WellSole", style = MaterialTheme.typography.headlineMedium)
      Spacer(Modifier.height(8.dp))
      Text("We’ll set permissions and a quick baseline, then you’re ready to stream live pressure maps.")
    }
    Button(onClick = onFinish, modifier = Modifier.align(Alignment.End)){
      Text("Finish Onboarding")
    }
  }
}

@Composable
fun OnboardingCompleteScreen(onContinue: ()->Unit){
  Column(
    modifier = Modifier.fillMaxSize().padding(24.dp),
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.CenterHorizontally
  ){
    Text(
      "Getting You To Love The Body You Have",
      style = MaterialTheme.typography.headlineLarge,
      textAlign = TextAlign.Center,
      lineHeight = 36.sp
    )
    Spacer(Modifier.height(16.dp))
    Text(
      "You’re all set. Let’s see how you move—live.",
      style = MaterialTheme.typography.bodyLarge,
      textAlign = TextAlign.Center
    )
    Spacer(Modifier.height(24.dp))
    Button(onClick = onContinue){ Text("Start Using WellSole") }
  }
}
