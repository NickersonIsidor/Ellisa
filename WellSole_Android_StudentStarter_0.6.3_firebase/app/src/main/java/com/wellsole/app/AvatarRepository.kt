
package com.wellsole.app
import android.net.Uri
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.ktx.storage
import com.google.firebase.auth.ktx.auth

object AvatarRepository {
  private val storage = Firebase.storage
  fun uploadAvatar(uri: Uri) = storage.getReference("avatars/${Firebase.auth.currentUser?.uid ?: "anonymous"}/current.jpg").putFile(uri)
}
