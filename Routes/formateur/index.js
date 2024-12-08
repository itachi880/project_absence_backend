const FormateurGroup = require("../../Models/FormateurGroup");
const Group = require("../../Models/Group");
const User = require("../../Models/User");
const roles = require("../../utils/roles");
const { Types, default: mongoose } = require("mongoose");
const Absence = require("../../Models/Absence");
const router = require("express").Router();

router.post('/absences', async (req, res) => {
    const { token=false,student_id, group_id, month, day, sessions, justificationId = null} = req.body;
    if(!token,!student_id,!group_id) return res.status(400).end("incoreccte les donnes que vous avez envoyer")
    const [auth_error, auth_data] = await jwt_verify(token);
    if (auth_error) return res.status(401).end("token pas valide");
    if (auth_data.role != roles.Formateur) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
    try {
        // Chercher une feuille d'absence existante
        let absenceRecord = await Absence.findOne({ student_id: student_id, group: group_id, month });
    
        if (absenceRecord) {
          // Vérifier si le jour existe déjà
          const existingDay = absenceRecord.absences.find(absence => absence.date === day);
    
          if (existingDay) {
            // Mettre à jour les sessions d'absence pour ce jour
            existingDay.sessions = Array.from(new Set([...existingDay.sessions, ...sessions]));
            existingDay.justification_id = justificationId;
          } else {
            // Ajouter une nouvelle entrée pour le jour
            absenceRecord.absences.push({ date: day, sessions, justification_id: justificationId });
          }
    
          // Recalculer le total des absences
          absenceRecord.total_absences = absenceRecord.absences.reduce((total, item) => total + item.sessions.length, 0);
    
          // Sauvegarder les changements
          await absenceRecord.save();
        } else {
          // Créer une nouvelle feuille d'absence
          const newAbsence = new Absence({
            student_id: student_id,
            group: group_id,
            month,
            absences: [{ date: day, sessions, justification_id: justificationId }],
            total_absences: sessions.length,
          });
    
          // Sauvegarder la nouvelle feuille
          await newAbsence.save();
        }
    
        console.log("Absence enregistrée ou mise à jour avec succès.");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'absence :", error);
      }
                 
  });
router.get('/getGoupsBy',async(req ,res)=>{
    const {token,formateur_id,date}=req.body
    if(!token) return res.status(400).end("incoreccte les donnes que vous avez envoyer")
    const [auth_error, auth_data] = await jwt_verify(token);
    if (auth_error) return res.status(401).end("token pas valide");
    if (auth_data.role != roles.Formateur) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
    try {
        // Convertir la date si nécessaire
        const targetDate = new Date(date); // Exemple : "2024-12-05"
    
        // Chercher les groupes associés à ce formateur à une date donnée
        const groups = await FormateurGroup.find({
          formateur: formateur_id,
          date: targetDate,
        }) // Ajout de `.populate` si vous voulez les détails du groupe
    
        return groups;
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes :", error);
        throw error;
      }
})
module.exports=router
