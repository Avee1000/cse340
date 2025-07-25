const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}




/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inv_id) {
  try {
    const res = await pool.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [inv_id]
    )
    return res.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

// async function testGetInventory() {
//   try {
//     const data = await getInventoryByClassificationId(1);
//     console.log(data);
//   } catch (err) {
//     console.error(err);
//   }
// }

// testGetInventory();

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById};
