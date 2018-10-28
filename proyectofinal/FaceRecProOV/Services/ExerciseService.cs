using MultiFaceRec.Constants;
using MultiFaceRec.Exercises;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Timers;

namespace MultiFaceRec.Services
{
    public class ExerciseService
    {

        public BackendService BackendServices { get; set; }
        public List<Activity> Exercises { get; set; }
        public static Timer _timer;

        public static ExerciseService _instance = null;

        public static ExerciseService Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new ExerciseService();
                }
                return _instance;
            }
        }

        public ExerciseService()
        {
            BackendServices = new BackendService();
            Exercises = new List<Activity>();

            InitializeExerciseService();
        }

        public Activity Start(int userId)
        {
            if (IsNotMakingExercise(userId))
            {

                Activity exercise = new Activity
                {
                    UserId = userId,
                    StartDate = DateTime.Now,
                    LastCheckTicks = DateTime.Now.Ticks,
                    MachineId = 1
                };

                Exercises.Add(exercise);

                return exercise;
            }
            else return null;
        }

        private void Finish(int userId)
        {
            var exercise = Exercises.Where(e => e.UserId == userId).FirstOrDefault();
            
            Exercises.Remove(exercise);

            exercise.Speed = CalculateSpeed();
            exercise.EndDate = DateTime.Now;
            exercise.ActivityType = ActivityConstants.ACTIVITY_TYPE_RUN.ToString();

            // CAMINÓ O CORRIÖ!!!

            BackendServices.FinishExercise(exercise);
        }

        public int CalculateSpeed()
        {
            return 10;
        }

        public bool IsNotMakingExercise(int userId)
        {
            var exercise = Exercises.Where(e => e.UserId == userId).FirstOrDefault();

            if (exercise == null) return true;
            else
            {
                Exercises.Remove(exercise);

                exercise.LastCheckTicks = DateTime.Now.Ticks;

                Exercises.Add(exercise);

                return false;
            }
        }

        public void InitializeExerciseService()
        {
            _timer = new Timer();

            _timer.Interval = 10000;
            _timer.Elapsed += OnTimedEvent_RemoveExcercise;
            _timer.AutoReset = true;
            _timer.Enabled = true;
        }

        private void OnTimedEvent_RemoveExcercise(Object source, ElapsedEventArgs e)
        {
            var h = "";

            foreach (var exercise in Exercises)
            {
                Stopwatch sw = Stopwatch.StartNew();

                var ticks = DateTime.Now.Ticks - exercise.LastCheckTicks;

                sw.Stop();

                var timeSpan = TimeSpan.FromTicks(ticks);

                var difference = timeSpan.TotalSeconds;

                if (difference > 10)
                {
                    Finish(exercise.UserId);
                }
            }
        }
    }
}
