export const destinationAreas = {
  Hunza: [
    "Karimabad",
    "Aliabad",
    "Attabad Lake",
    "Passu",
    "Gulmit",
    "Duikar",
    "Altit",
  ],
  Skardu: [
    "Skardu City",
    "Shangrila",
    "Shigar",
    "Khaplu",
    "Hussainabad",
    "Sadpara",
  ],
  Naran: [
    "Naran Bazaar",
    "Saif-ul-Malook Road",
    "Batakundi",
    "Jalkhad",
    "Lalazar",
  ],
  Swat: ["Mingora", "Fizagat", "Malam Jabba", "Kalam", "Bahrain", "Madyan"],
  Murree: ["Mall Road", "Bhurban", "Patriata", "Kashmir Point", "Lower Topa"],
  Gilgit: ["Gilgit City", "Danyore", "Jutial", "Naltar"],
};

export const destinations = Object.keys(destinationAreas);

export const getAreasByDestination = (destination) =>
  destinationAreas[destination] || [];
