const firebase = require("firebase");

export const getToppgerBgImage = (isChampion = false) => {
    if(isChampion)   return "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/afabd1f2-46f0-4ff5-985f-0c15429d2afd/ddy5spv-d50991c3-895f-4852-8721-3594963be481.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2FmYWJkMWYyLTQ2ZjAtNGZmNS05ODVmLTBjMTU0MjlkMmFmZFwvZGR5NXNwdi1kNTA5OTFjMy04OTVmLTQ4NTItODcyMS0zNTk0OTYzYmU0ODEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.JrvlnKfo-CIDI_WMWOjT1LVhjYP0xXG4LVHEgclWTPg";
    return "https://www.freepnglogos.com/uploads/1-number-png/number-1-rankings-georgia-tech-40.png";
}

export const getFirebaseCurrentTime = () => {
    return firebase.default.firestore.Timestamp.fromDate(new Date());
}
