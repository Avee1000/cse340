'use strict' 
 
//  // Get a list of items in inventory based on the classification_id 
//  let classificationList = document.querySelector("#classificationList")
//  classificationList.addEventListener("change", function () { 
//   let classification_id = classificationList.value 
//   console.log(`classification_id is: ${classification_id}`) 
//   let classIdURL = "/inv/getInventory/"+classification_id 
//   fetch(classIdURL) 
//   .then(function (response) { 
//       if (response.ok) { 
//        return response.json(); 
//    } 
//    throw Error("Network response was not OK"); 
//   }) 
//   .then(function (data) { 
//    console.log(data); 
//    buildInventoryList(data); 
//   }) 
//   .catch(function (error) { 
//    console.log('There was a problem: ', error.message) 
//   }) 
//  })

document.addEventListener("DOMContentLoaded", () => {
    // 2) Find the dropdown in the page.
    const classificationList = document.getElementById("classificationList");

    // 3) When the user picks something, run our code.
    classificationList.addEventListener("change", handleChange);

    async function handleChange() {
        // 4) Get the chosen value (e.g., "1" or "2").
        const classificationId = classificationList.value;

        // If the user picked the placeholder (empty), do nothing.
        if (!classificationId) return;

        // 5) Build the URL we’ll ask the server for.
        const url = `/inv/getInventory/${encodeURIComponent(classificationId)}`;

        try {
            // 6) Ask the server for data.
            const response = await fetch(url);

            // If the server said “not OK” (like 404 or 500), stop and show why.
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            // 7) Turn the server’s reply into a real JavaScript object/array.
            //    IMPORTANT: Only call .json() ONCE.
            const data = await response.json();

            // 8) See what we got (you can open DevTools → Console to view this).
            console.log("Inventory data:", data);

            // 9) Hand the data to your UI builder (this is your function).
            //    It should take the data and show it on the page.
            buildInventoryList(data);
        } catch (err) {
            // 10) If anything went wrong above, tell us in the console.
            console.error("There was a problem:", err.message);
        }
    }
});

 
 // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
 let inventoryDisplay = document.getElementById("inventoryDisplay"); 
 // Set up the table labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all vehicles in the array and put each in a row 
 data.forEach(function (element) { 
  console.log(element.inv_id + ", " + element.inv_model); 
  dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
  dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
  dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 
 dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 inventoryDisplay.innerHTML = dataTable; 
}