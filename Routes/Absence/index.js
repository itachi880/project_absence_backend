const Absence = require("../../Models/Absence");
const { jwt_verify } = require("../../utils/jwt_auth")
const roles = require("../../utils/roles");
// const { jwt_verify } = require("../../utils/jwt_auth");
const { DaysInMonths } = require("../../utils/DaysInMonths");
const router = require("express").Router();
router.get("/getByID", async (req, res) => {
  const { token = false, id = false } = req.query;
  if (!token || !id) return res.status(400).end("data incompleate");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("you don't have access");
  try {
    const doc = await Absence.findById(id);
    if (!doc) return res.status(404).end("not found");
    if (doc.student_id !== auth_data.id && auth_data.role !== roles.general_supervisor) return res.status(401).end("you dont have access to this data");
    return res.json(doc);
  } catch (e) {
    console.log(e);
    res.status(500).json("error in server");
  }
});
router.post('/register', async (req, res) => {
  const { token = false, student_id, group_id, month, day, sessions, } = req.body;
  if (!token, !student_id, !group_id) return res.status(400).end("incoreccte les donnes que vous avez envoyer")
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.Formateur) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  try {
    const absenceRecord = await Absence.findOne({ student_id, month });

    if (!absenceRecord) return await addAbsence(month,day,sessions) && res.end("done");

    const absenceDay = absenceRecord.absences.findIndex(absence => absence.date == day);
    absenceRecord.absences[absenceDay].sessions = new Set([...absenceRecord.absences[absenceDay].sessions,...sessions])
    absenceRecord.total_absences += sessions.length;
    await absenceRecord.save();
    return res.end("done")

  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'absence :", error);
    return res.status(500).end("error")
  }
});
async function addAbsence(month,day,sessions=[]){
   if (!DaysInMonths[ month]) DaysInMonths[ month] = new Date( month + "-0").getDate();
  const absences = Array.from({ length: DaysInMonths[month] }, (_, index) => ({
    date: index + 1,
    sessions: [],
    justification_id: null
  }))
  absences[day - 1].sessions = sessions;
  return await new Absence({ student_id, month, absences,total_absences:sessions.length }).save()
}
router.post('/getGroupsFormateur',async (req,res)=>{
  const { token = false, group_id, day, sessions} = req.body;
  if (!token, !group_id) return res.status(400).end("incoreccte les donnes que vous avez envoyer")
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.Formateur) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  try{
    const formateurGroups = await FormateurGroupCollection.find({ formateur: auth_data.id }).populate("id_group");
    if (formateurGroups.length == 0) {
      return res.status(404).end("Ce formateur n'a aucun groupe associé.");
    }
    const results = formateurGroups.map(e => ({
      groupId: e.id_group,
      Name: e.formateur,
      sessions: e.sessions,
      date: e.date.toISOString().split("T")[0], 
    }));
    return res.json(results);
  }catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    return res.status(500).end("Erreur interne du serveur.");
  }
})
module.exports = router;
