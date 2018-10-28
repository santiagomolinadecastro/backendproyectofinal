using Emgu.CV;
using Emgu.CV.Structure;
using MultiFaceRec.Domain;
using MultiFaceRec.Exercises;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace MultiFaceRec.Services
{
    public class BackendService
    {
        Image<Gray, byte> result, TrainedFace = null;

        public void StartExercise(Activity exercise)
        {

        }

        public void FinishExercise(Activity exercise)
        {
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create("http://35.196.241.219:3000/actividades");
            request.Method = "POST";
            request.AllowAutoRedirect = false;
            request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
            request.ContentType = "application/x-www-form-urlencoded";


            Stream reqStream = request.GetRequestStream();
            string strNew = "userId=" + exercise.UserId + "&tipo=" + exercise.Type + "&velocidad=" + exercise.Speed + "&" +
                //"fechaInicio='" + exercise.StartDate.Year + "-" + exercise.StartDate.Month + "-" + exercise.StartDate.Day + " " + exercise.StartDate.Hour + ":" + 00 + ":" + exercise.StartDate.Second + "'&" +
                //"fechaFin='" + exercise.EndDate.Year + "-" + exercise.EndDate.Month + "-" + exercise.EndDate.Day + " " + exercise.EndDate.Hour + ":" + 20 + ":" + exercise.EndDate.Second + "'&" +
                "fechaInicio='" + exercise.StartDate.Year + "-" + exercise.StartDate.Month + "-" + exercise.StartDate.Day + " " + exercise.StartDate.Hour + ":" + exercise.StartDate.Minute + ":" + exercise.StartDate.Second + "'&" +
                "fechaFin='" + exercise.EndDate.Year + "-" + exercise.EndDate.Month + "-" + exercise.EndDate.Day + " " + exercise.EndDate.Hour + ":" + exercise.EndDate.Minute + ":" + exercise.EndDate.Second + "'&" +
                "tipoActividadId=" + exercise.ActivityType + "&" +
                "maquinaId=" + exercise.MachineId;

            byte[] postArray = Encoding.ASCII.GetBytes(strNew);
            reqStream.Write(postArray, 0, postArray.Length);
            reqStream.Close();

            try {

                StreamReader sr = new StreamReader(request.GetResponse().GetResponseStream());
                string Result = sr.ReadToEnd();

            } catch (WebException webex)
            {
                WebResponse errResp = webex.Response;
                using (Stream respStream = errResp.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(respStream);
                    string text = reader.ReadToEnd();
                }

            } catch (Exception ex)
            {
                throw ex;
            }

            //var postData = JsonConvert.SerializeObject(exercise);

            //var data = Encoding.ASCII.GetBytes(postData);

            //request.Method = "POST";
            //request.ContentType = "application/x-www-form-urlencoded";
            //request.ContentLength = data.Length;

            //using (var stream = request.GetRequestStream())
            //{
            //    stream.Write(data, 0, data.Length);
            //}

            //var response = (HttpWebResponse)request.GetResponse();

            //var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
        }

        public void DownloadNews()
        {
            System.IO.Directory.CreateDirectory("TrainedFaces/downloaded/");

            var usuarios = GetPhotos();

            List<string> paths = new List<string>();

            foreach (var usuario in usuarios)
            {
                paths.Add(usuario.Id + ".jpeg");
            }

            TransformFaces(paths);
        }

        #region - Private Methods -

        private List<Usuario> GetPhotos()
        {
            string rt;

            List<string> paths = new List<string>();

            WebRequest request = WebRequest.Create("http://35.196.241.219:3000/usuarios");

            WebResponse response = request.GetResponse();

            Stream dataStream = response.GetResponseStream();

            StreamReader reader = new StreamReader(dataStream);

            rt = reader.ReadToEnd();


            reader.Close();
            response.Close();

            JArray json = JArray.Parse(rt);

            List<Usuario> usuarios = JsonConvert.DeserializeObject<List<Usuario>>(rt);

            var count = 0;

            foreach (var usuario in usuarios)
            {
                if (usuario.Foto != null)
                {
                    var path = "TrainedFaces/downloaded/" + usuario.Id + ".jpeg";

                    var token2 = Regex.Replace(usuario.Foto, @"\t|\n|\r", "");

                    byte[] bytes = Convert.FromBase64String(token2);

                    using (var imageFile = new FileStream(path, FileMode.Create))
                    {
                        imageFile.Write(bytes, 0, bytes.Length);
                        imageFile.Flush();
                    }
                }
            }

            return usuarios;

        }

        private void TransformFaces(List<string> paths)
        {


            //Write the number of triained faces in a file text for further load
            
            var count = 0;
            var secondLine = ""; 

            foreach (var path in paths) {

                try
                {
                    Image<Gray, byte> newFace = null;

                    // Default xml
                    if (newFace == null) newFace = HaarDetectionDefault(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_CANNY_PRUNING, path);
                    if (newFace == null) newFace = HaarDetectionDefault(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DEFAULT, path);
                    if (newFace == null) newFace = HaarDetectionDefault(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_ROUGH_SEARCH, path);
                    if (newFace == null) newFace = HaarDetectionDefault(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.FIND_BIGGEST_OBJECT, path);
                    if (newFace == null) newFace = HaarDetectionDefault(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.SCALE_IMAGE, path);

                    ////// Alt xml
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_CANNY_PRUNING, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DEFAULT, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_ROUGH_SEARCH, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.FIND_BIGGEST_OBJECT, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.SCALE_IMAGE, path);

                    ////// All2 xml
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_CANNY_PRUNING, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DEFAULT, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_ROUGH_SEARCH, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.FIND_BIGGEST_OBJECT, path);
                    //if (newFace == null) newFace = HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.SCALE_IMAGE, path);

                    newFace.Save(Application.StartupPath + "/TrainedFaces/face" + path.Replace(".jpeg",".bmp"));

                    secondLine += path + "%";

                    count++;
                }
                catch (Exception ex)
                {
                }
            }
            File.WriteAllText(Application.StartupPath + "/TrainedFaces/TrainedLabels.txt", count + "%");
            File.AppendAllText(Application.StartupPath + "/TrainedFaces/TrainedLabels.txt", secondLine);
        }

        private Image<Gray, byte> HaarDetectionDefault(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE haarDetectionTipe, string path)
        {
            return HaarDetection("haarcascade_frontalface_default.xml", haarDetectionTipe, path);
        }

        private Image<Gray, byte> HaarDetectionAlt(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE haarDetectionTipe, string path)
        {
            return HaarDetection("haarcascade_frontalface_alt.xml", haarDetectionTipe, path);
        }
        private Image<Gray, byte> HaarDetectionAlt2(Emgu.CV.CvEnum.HAAR_DETECTION_TYPE haarDetectionTipe, string path)
        {
            return HaarDetection("haarcascade_frontalface_alt2.xml", haarDetectionTipe, path);
        }

        private Image<Gray, byte> HaarDetection(string xmlFile,Emgu.CV.CvEnum.HAAR_DETECTION_TYPE haarDetectionTipe, string path)
        {
            var bitmap = new Bitmap("TrainedFaces/downloaded/" + path);

            var image = new Image<Gray, Byte>(bitmap);

            //Face Detector
            MCvAvgComp[][] faces = image.DetectHaarCascade(
                new HaarCascade(xmlFile),
                1.1,
                10,
                haarDetectionTipe,
                new Size(40, 40)
            );


            Image<Gray, byte> newFace = null;

            //Action for each element detected
            foreach (MCvAvgComp f in faces[0])
            {
                newFace = image.Copy(f.rect).Convert<Gray, byte>().Resize(200, 200, Emgu.CV.CvEnum.INTER.CV_INTER_CUBIC);
                break;
            }

            return newFace;
        }

        #endregion - Private Methods -
    }
}
