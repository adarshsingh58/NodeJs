module.exports={"hi":"hi"}; 
/*This will work, coz now module.exports points to a different object
 * but require returns module.exports itself no matter what it points at, so this values is returned to require
 */
