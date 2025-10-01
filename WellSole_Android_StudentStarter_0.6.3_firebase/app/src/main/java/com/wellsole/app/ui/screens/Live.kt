
package com.wellsole.app.ui.screens
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.wellsole.app.R
import com.google.firebase.ktx.Firebase
import com.google.firebase.remoteconfig.ktx.remoteConfig
import com.google.firebase.remoteconfig.remoteConfigSettings
import kotlinx.coroutines.tasks.await

@Composable
fun LiveScreen(){
  val ctx = LocalContext.current
  val prefs = ctx.getSharedPreferences("wellsole", 0)
  val today = java.text.SimpleDateFormat("yyyyMMdd").format(java.util.Date())
  var showBanner by remember { mutableStateOf(prefs.getString("brandline_shown", "") != today) }

  var sigma by remember { mutableStateOf(0.16) }
  var alpha by remember { mutableStateOf(0.40) }
  LaunchedEffect(Unit){
    val rc = Firebase.remoteConfig
    rc.setConfigSettingsAsync(remoteConfigSettings { minimumFetchIntervalInSeconds = 0 })
    rc.setDefaultsAsync(R.xml.remote_config_defaults)
    rc.fetchAndActivate().await()
    sigma = rc.getDouble("heatmap_sigma"); if (sigma == 0.0) sigma = 0.16
    alpha = rc.getDouble("heatmap_alpha"); if (alpha == 0.0) alpha = 0.40
  }

  Scaffold(topBar = { TopAppBar(title = { Text("WellSole Live") }) }) { p ->
    Box(Modifier.padding(p).fillMaxSize()) {
      Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Live heatmap goes here (sigma=%.2f, alpha=%.2f)".format(sigma, alpha))
      }
      if (showBanner) {
        Surface(
          color = MaterialTheme.colorScheme.surfaceVariant,
          tonalElevation = 2.dp,
          modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth().padding(12.dp)
        ){
          Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically){
            Text(stringResource(id = R.string.brandline), modifier = Modifier.weight(1f))
            Spacer(Modifier.width(8.dp))
            TextButton(onClick = {
              prefs.edit().putString("brandline_shown", today).apply()
              showBanner = false
            }){ Text("Dismiss") }
          }
        }
      }
    }
  }
}
