
package com.wellsole.app
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.firebase.auth.ktx.auth
import com.google.android.gms.tasks.Task
import com.google.firebase.firestore.FieldValue

object SessionRepository {
  private val db = Firebase.firestore
  fun startSession(sessionId: String): Task<Void> {
    val uid = Firebase.auth.currentUser?.uid ?: "anonymous"
    val data = hashMapOf(
      "ownerUid" to uid,
      "startAt" to FieldValue.serverTimestamp(),
      "createdAt" to FieldValue.serverTimestamp()
    )
    return db.collection("sessions").document(sessionId).set(data)
  }
  fun endSession(sessionId: String, steps: Int, leftLoad: Double, rightLoad: Double): Task<Void> {
    val data = hashMapOf(
      "endAt" to FieldValue.serverTimestamp(),
      "steps" to steps,
      "lrLoad" to mapOf("left" to leftLoad, "right" to rightLoad)
    )
    return db.collection("sessions").document(sessionId).update(data as Map<String, Any>)
  }
}
