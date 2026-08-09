import { db, storage } from '../config/firebase';
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, getDocs 
} from 'firebase/firestore';
import { 
  ref, uploadBytesResumable, getDownloadURL 
} from 'firebase/storage';
import { CAMPUS_STREET_VIEW_NODES } from '../data/streetViewData';

const LOCAL_STORAGE_KEY = 'csjmu_custom_360_nodes_cache';

/**
 * Get initial merged list of nodes (Pre-populated default nodes + Local cache + Firebase nodes)
 */
export function getStored360Nodes() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...CAMPUS_STREET_VIEW_NODES, ...parsed };
    }
  } catch (e) {
    console.warn("Local storage cache read error:", e);
  }
  return { ...CAMPUS_STREET_VIEW_NODES };
}

/**
 * Real-time Subscription to Firebase Firestore 360 Nodes Collection
 */
export function subscribeCampus360Nodes(onNodesUpdated) {
  // Always emit initial merged state first
  onNodesUpdated(getStored360Nodes());

  if (!db) return () => {};

  try {
    const nodesRef = collection(db, 'street_view_nodes');
    const unsubscribe = onSnapshot(nodesRef, (snapshot) => {
      const firebaseNodes = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id) {
          firebaseNodes[data.id] = data;
        }
      });

      const merged = { ...CAMPUS_STREET_VIEW_NODES, ...firebaseNodes };
      
      // Update local storage cache
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(firebaseNodes));
      } catch (e) {
        console.warn("Failed to update 360 node cache:", e);
      }

      onNodesUpdated(merged);
    }, (error) => {
      console.warn("Firestore subscription warning (using local fallback store):", error);
    });

    return unsubscribe;
  } catch (err) {
    console.warn("Firestore connection error:", err);
    return () => {};
  }
}

/**
 * Upload 360 Equirectangular Image File to Firebase Storage (with progress callback)
 */
export async function upload360ImageFile(file, onProgress) {
  if (!file) throw new Error("No image file provided");

  const fileName = `360_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // If Firebase Storage is connected
  if (storage) {
    try {
      const storageRef = ref(storage, `360-panoramas/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (onProgress) onProgress(progress);
          },
          (error) => {
            console.warn("Firebase Storage upload error, falling back to local object URL:", error);
            const fallbackUrl = URL.createObjectURL(file);
            resolve(fallbackUrl);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    } catch (e) {
      console.warn("Firebase Storage exception, using data URL fallback:", e);
    }
  }

  // Fallback: Convert to Data URL / Blob URL for instant local demo usage
  return new Promise((resolve) => {
    if (onProgress) onProgress(50);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (onProgress) onProgress(100);
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Save or Update a 360 Campus Node in Firestore + Local Cache
 */
export async function save360CampusNode(nodeData) {
  if (!nodeData || !nodeData.id) throw new Error("Invalid node data");

  const formattedNode = {
    id: nodeData.id,
    name: nodeData.name || "Custom Campus 360 Location",
    category: nodeData.category || "Campus Location",
    lat: parseFloat(nodeData.lat) || 26.4970,
    lng: parseFloat(nodeData.lng) || 80.2666,
    panoramaUrl: nodeData.panoramaUrl,
    description: nodeData.description || "",
    hotspots: nodeData.hotspots || [],
    updatedAt: new Date().toISOString()
  };

  // 1. Write to Firestore if connected
  if (db) {
    try {
      const docRef = doc(db, 'street_view_nodes', formattedNode.id);
      await setDoc(docRef, formattedNode, { merge: true });
    } catch (err) {
      console.warn("Firestore setDoc failed, saving to local cache:", err);
    }
  }

  // 2. Write to local storage cache
  try {
    const cached = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    cached[formattedNode.id] = formattedNode;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }

  return formattedNode;
}

/**
 * Delete a 360 Campus Node from Firestore + Local Cache
 */
export async function delete360CampusNode(nodeId) {
  if (!nodeId) return;

  if (db) {
    try {
      await deleteDoc(doc(db, 'street_view_nodes', nodeId));
    } catch (e) {
      console.warn("Firestore delete failed:", e);
    }
  }

  try {
    const cached = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    delete cached[nodeId];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached));
  } catch (e) {
    console.warn("LocalStorage delete error:", e);
  }
}
