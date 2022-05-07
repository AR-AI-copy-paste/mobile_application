//Recoil import
import { atom } from "recoil";

export const authState = atom({
  key: "authState",
  default: null,
});

export const userProfileState  = atom({
  key: "userProfile",
  default: null,
})