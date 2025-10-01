
package com.wellsole.app.ui.screens
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.wellsole.app.R

@Composable
fun AboutScreen(onBack: ()->Unit){
  Scaffold(topBar = {
    TopAppBar(title = { Text(stringResource(id = R.string.about_title)) })
  }){ p ->
    Column(
      modifier = Modifier.padding(p).fillMaxSize().padding(24.dp),
      verticalArrangement = Arrangement.Top,
      horizontalAlignment = Alignment.Start
    ){
      Text(stringResource(id = R.string.about_mission), style = MaterialTheme.typography.titleMedium)
      Spacer(Modifier.height(16.dp))
      Text(stringResource(id = R.string.brandline), style = MaterialTheme.typography.headlineSmall, textAlign = TextAlign.Start)
      Spacer(Modifier.height(24.dp))
      Button(onClick = onBack){ Text("Back") }
    }
  }
}
