//Web3Storage import

//ENV variable
import { IPFS_STORAGE } from "@env";

//FileSystem import
import * as FileSystem from "expo-file-system";

export const uploadImage = async (uri) => {
  if (!uri) return;

  try {

    

    const response = await FileSystem.uploadAsync(
      "https://api.web3.storage/upload",
      uri,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + IPFS_STORAGE,
        },
      }
    );

    const cid = JSON.parse(response.body).cid;

    return `https://${cid}.ipfs.dweb.link/`;
  } catch (e) {
    console.log(e);
  }
};

export const defaultProfileImage = "https://bafybeihj2j6solt4kbl6doc7w2vw7e5eqgc66fsuzpattjnn4mjhxici7y.ipfs.dweb.link/avatar.png"
