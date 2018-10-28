
//Multiple face detection and recognition in real time
//Using EmguCV cross platform .Net wrapper to the Intel OpenCV image processing library for C#.Net
//Writed by Sergio Andrés Guitérrez Rojas
//"Serg3ant" for the delveloper comunity
// Sergiogut1805@hotmail.com
//Regards from Bucaramanga-Colombia ;)

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using Emgu.CV;
using Emgu.CV.Structure;
using Emgu.CV.CvEnum;
using System.IO;
using System.Diagnostics;
using MultiFaceRec.Services;
using System.Linq;

namespace MultiFaceRec
{
    public partial class FrmPrincipal : Form
    {
        //Declararation of all variables, vectors and haarcascades
        public Image<Bgr, Byte> currentFrame;
        public Capture grabber;
        public HaarCascade face;
        public HaarCascade eye;
        public MCvFont font = new MCvFont(FONT.CV_FONT_HERSHEY_TRIPLEX, 0.5d, 0.5d);
        public Image<Gray, byte> result, TrainedFace = null;
        public Image<Gray, byte> gray = null;
        public List<Image<Gray, byte>> trainingImages = new List<Image<Gray, byte>>();
        public List<string> labels= new List<string>();
        public List<string> NamePersons = new List<string>();
        public int ContTrain, NumLabels, t;
        public string name, names = null;
        public ExerciseService _exerciseService = new ExerciseService();
        public List<string> _timesAppeared = new List<string>();

        public FrmPrincipal()
        {
            InitializeComponent();
            BackendService service = new BackendService();
           
            service.DownloadNews();

            //Load haarcascades for face detection
            face = new HaarCascade("haarcascade_frontalface_default.xml");
            //eye = new HaarCascade("haarcascade_eye.xml");
            try
            {
                //Load of previus trainned faces and labels for each image
                string Labelsinfo = File.ReadAllText(Application.StartupPath + "/TrainedFaces/TrainedLabels.txt");
                string[] Labels = Labelsinfo.Split('%');
                NumLabels = Convert.ToInt16(Labels[0]);
                ContTrain = NumLabels;
                string LoadFaces;

                for (int tf = 1; tf < NumLabels+1; tf++)
                {
                    try
                    {
                        LoadFaces = "face" + tf + ".bmp";
                        trainingImages.Add(new Image<Gray, byte>(Application.StartupPath + "/TrainedFaces/" + LoadFaces));
                        labels.Add(Labels[tf]);
                    }
                    catch (Exception ex) { };
                }
            
            }
            catch(Exception e)
            {
                //MessageBox.Show(e.ToString());
                MessageBox.Show("No hay personas agregadas, comience la detección y luego agregue una persona.", "", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }

        }

        private void FrmPrincipal_Load(object sender, EventArgs e)
        {

        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            //Initialize the capture device
            //grabber = new Capture("C:\\FOTOS\\videos\\juanicorre.mp4");
            grabber = new Capture();
            grabber.QueryFrame();
            //Initialize the FrameGraber event
            Application.Idle += new EventHandler(FrameGrabber);
            button1.Enabled = false;

        }


        private void button2_Click(object sender, System.EventArgs e)
        {
            try
            {
                

                //Trained face counter
                ContTrain = ContTrain + 1;

                //Get a gray frame from capture device
                gray = grabber.QueryGrayFrame().Resize(320, 240, Emgu.CV.CvEnum.INTER.CV_INTER_CUBIC);
                //Face Detector
                MCvAvgComp[][] facesDetected = gray.DetectHaarCascade(
                face,
                1.2,
                10,
                Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_CANNY_PRUNING,
                new Size(20, 20));

                //Action for each element detected
                foreach (MCvAvgComp f in facesDetected[0])
                {
                    TrainedFace = currentFrame.Copy(f.rect).Convert<Gray, byte>();
                    break;
                }

                //resize face detected image for force to compare the same size with the 
                //test image with cubic interpolation type method
                TrainedFace = result.Resize(100, 100, Emgu.CV.CvEnum.INTER.CV_INTER_CUBIC);
                trainingImages.Add(TrainedFace);
                labels.Add(textBox1.Text);

                //Show face added in gray scale
                imageBox1.Image = TrainedFace;

                //Write the number of triained faces in a file text for further load
                File.WriteAllText(Application.StartupPath + "/TrainedFaces/TrainedLabels.txt", trainingImages.ToArray().Length.ToString() + "%");

                //Write the labels of triained faces in a file text for further load
                for (int i = 1; i < trainingImages.ToArray().Length + 1; i++)
                {
                    trainingImages.ToArray()[i - 1].Save(Application.StartupPath + "/TrainedFaces/face" + i + ".bmp");
                    File.AppendAllText(Application.StartupPath + "/TrainedFaces/TrainedLabels.txt", labels.ToArray()[i - 1] + "%");
                }

                MessageBox.Show(textBox1.Text + " - Se detectó y se guardó.", "Entrenamiento terminado.", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch
            {
                MessageBox.Show("Habilite la detección primero.", "Falló el entrenamiento.", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }
        }


        void FrameGrabber(object sender, EventArgs e)
        {
            try
            {
                label3.Text = "0";
                //label4.Text = "";
                NamePersons.Add("");

                //Get the current frame form capture device
                //currentFrame = grabber.QueryFrame().Rotate(90, new Bgr(255, 255, 255)).Resize(320, 240, Emgu.CV.CvEnum.INTER.CV_INTER_CUBIC);
                currentFrame = grabber.QueryFrame().Resize(320, 240, Emgu.CV.CvEnum.INTER.CV_INTER_CUBIC);

                //Convert it to Grayscale
                gray = currentFrame.Convert<Gray, Byte>();

                //Face Detector
                MCvAvgComp[][] facesDetected = gray.DetectHaarCascade(face,
                                                                        1.2,
                                                                        10,
                                                                        Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_CANNY_PRUNING,
                                                                        new Size(20, 20));

                //Action for each element detected
                foreach (MCvAvgComp f in facesDetected[0])
                {
                    t = t + 1;

                    result = currentFrame.Copy(f.rect).Convert<Gray, byte>().Resize(100, 100, Emgu.CV.CvEnum.INTER.CV_INTER_CUBIC);
                    //draw the face detected in the 0th (gray) channel with blue color
                    currentFrame.Draw(f.rect, new Bgr(Color.Red), 2);


                    if (trainingImages.ToArray().Length != 0)
                    {
                        //TermCriteria for face recognition with numbers of trained images like maxIteration
                        MCvTermCriteria termCrit = new MCvTermCriteria(ContTrain, 0.001);

                        //Eigen face recognizer
                        EigenObjectRecognizer recognizer = new EigenObjectRecognizer(
                                                                        trainingImages.ToArray(),
                                                                        labels.ToArray(),
                                                                        5000,
                                                                        ref termCrit);

                        name = recognizer.Recognize(result);

                        // PONER ACÁ EXCERCICE SERVICE.


                        //Draw the label for each face detected and recognized
                        currentFrame.Draw(name, ref font, new Point(f.rect.X - 2, f.rect.Y - 2), new Bgr(Color.LightGreen));

                        _timesAppeared.Add(name);

                    }

                    NamePersons[t - 1] = name;
                    NamePersons.Add("");

                    //Set the number of faces detected on the scene
                    label3.Text = facesDetected[0].Length.ToString();

                    if (name != string.Empty) {

                        var userId = int.Parse(name.Substring(0, name.IndexOf(".jpeg")));

                        _exerciseService.Start(userId);
                    }
                    /*
                    //Set the region of interest on the faces

                    gray.ROI = f.rect;
                    MCvAvgComp[][] eyesDetected = gray.DetectHaarCascade(
                        eye,
                        1.1,
                        10,
                        Emgu.CV.CvEnum.HAAR_DETECTION_TYPE.DO_CANNY_PRUNING,
                        new Size(20, 20));
                    gray.ROI = Rectangle.Empty;

                    foreach (MCvAvgComp ey in eyesDetected[0])
                    {
                        Rectangle eyeRect = ey.rect;
                        eyeRect.Offset(f.rect.X, f.rect.Y);
                        currentFrame.Draw(eyeRect, new Bgr(Color.Blue), 2);
                    }
                        */

                }
                t = 0;

                //Names concatenation of persons recognized
                for (int nnn = 0; nnn < facesDetected[0].Length; nnn++)
                {
                    names = names + NamePersons[nnn] + ", ";

                    //if (NamePersons[nnn] != string.Empty)
                    //{
                    //    var i = int.Parse(NamePersons[nnn].Substring(0, NamePersons[nnn].IndexOf(".jpeg")));

                    //    exerciseService.Start(i);
                    //    var index = exerciseService.Exercises.IndexOf(exerciseService.Exercises.Where(ee => ee.UserId == i).FirstOrDefault());

                    //    exerciseService.Exercises[index].LastCheckTicks = DateTime.Now.Ticks;
                    //}
                }
                //Show the faces procesed and recognized
                imageBoxFrameGrabber.Image = currentFrame;
                label4.Text = names;
                names = "";
                //Clear the list(vector) of names
                NamePersons.Clear();
            } catch (Exception ex)
            {
                var distinct = _timesAppeared.GroupBy(test => test)
                       .Select(grp => grp)
                       .ToList();
            }



        }

        private void button3_Click(object sender, EventArgs e)
        {
            Process.Start("Donate.html");
        }

    }
}