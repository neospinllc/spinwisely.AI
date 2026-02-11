import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

// User Management
export async function createUser(uid, userData) {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            createdAt: Timestamp.now(),
            lastLogin: Timestamp.now(),
            role: 'user', // 'user' or 'admin'
            isActive: true,
        })
        return { success: true }
    } catch (error) {
        console.error('Error creating user:', error)
        return { success: false, error: error.message }
    }
}

export async function getUser(uid) {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() }
        }
        return { success: false, error: 'User not found' }
    } catch (error) {
        console.error('Error getting user:', error)
        return { success: false, error: error.message }
    }
}

export async function updateUser(uid, updates) {
    try {
        await updateDoc(doc(db, 'users', uid), {
            ...updates,
            updatedAt: Timestamp.now(),
        })
        return { success: true }
    } catch (error) {
        console.error('Error updating user:', error)
        return { success: false, error: error.message }
    }
}

export async function getAllUsers() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const users = []
        usersSnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() })
        })
        return { success: true, data: users }
    } catch (error) {
        console.error('Error getting users:', error)
        return { success: false, error: error.message }
    }
}

// Activity Logging
export async function logActivity(uid, activity) {
    try {
        const activityData = {
            uid,
            ...activity,
            timestamp: Timestamp.now(),
        }
        await setDoc(doc(collection(db, 'activities')), activityData)
        return { success: true }
    } catch (error) {
        console.error('Error logging activity:', error)
        return { success: false, error: error.message }
    }
}

export async function getActivityLogs(options = {}) {
    try {
        const { uid, limitCount = 100 } = options
        let q = query(
            collection(db, 'activities'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        )

        if (uid) {
            q = query(
                collection(db, 'activities'),
                where('uid', '==', uid),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            )
        }

        const snapshot = await getDocs(q)
        const activities = []
        snapshot.forEach((doc) => {
            activities.push({ id: doc.id, ...doc.data() })
        })
        return { success: true, data: activities }
    } catch (error) {
        console.error('Error getting activity logs:', error)
        return { success: false, error: error.message }
    }
}

// Document Metadata Management
export async function saveDocumentMetadata(documentData) {
    try {
        const docRef = doc(collection(db, 'documents'))
        await setDoc(docRef, {
            ...documentData,
            createdAt: Timestamp.now(),
            version: 1,
        })
        return { success: true, id: docRef.id }
    } catch (error) {
        console.error('Error saving document metadata:', error)
        return { success: false, error: error.message }
    }
}

export async function getDocumentMetadata(documentId) {
    try {
        const docSnap = await getDoc(doc(db, 'documents', documentId))
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() }
        }
        return { success: false, error: 'Document not found' }
    } catch (error) {
        console.error('Error getting document metadata:', error)
        return { success: false, error: error.message }
    }
}

export async function getAllDocuments() {
    try {
        const docsSnapshot = await getDocs(collection(db, 'documents'))
        const documents = []
        docsSnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() })
        })
        return { success: true, data: documents }
    } catch (error) {
        console.error('Error getting documents:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteDocument(documentId) {
    try {
        await deleteDoc(doc(db, 'documents', documentId))
        return { success: true }
    } catch (error) {
        console.error('Error deleting document:', error)
        return { success: false, error: error.message }
    }
}

// Permissions Management
export async function setDocumentPermissions(documentId, permissions) {
    try {
        await setDoc(doc(db, 'permissions', documentId), {
            documentId,
            ...permissions,
            updatedAt: Timestamp.now(),
        })
        return { success: true }
    } catch (error) {
        console.error('Error setting permissions:', error)
        return { success: false, error: error.message }
    }
}

export async function getDocumentPermissions(documentId) {
    try {
        const permDoc = await getDoc(doc(db, 'permissions', documentId))
        if (permDoc.exists()) {
            return { success: true, data: permDoc.data() }
        }
        return { success: true, data: { allowedUsers: [], allowedRoles: ['admin'] } }
    } catch (error) {
        console.error('Error getting permissions:', error)
        return { success: false, error: error.message }
    }
}

export async function checkUserAccess(uid, documentId) {
    try {
        const userResult = await getUser(uid)
        if (!userResult.success) return false

        const user = userResult.data
        if (user.role === 'admin') return true

        const permResult = await getDocumentPermissions(documentId)
        if (!permResult.success) return false

        const permissions = permResult.data
        return (
            permissions.allowedUsers?.includes(uid) ||
            permissions.allowedRoles?.includes(user.role)
        )
    } catch (error) {
        console.error('Error checking user access:', error)
        return false
    }
}
