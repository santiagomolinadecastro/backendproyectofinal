using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MultiFaceRec.Exercises
{
    
    public class Activity
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("userId")]
        public int UserId { get; set; }

        [JsonProperty("tipo")]
        public int Type { get; set; }

        [JsonProperty("velocidad")]
        public int Speed { get; set; }

        [JsonProperty("fechaInicio")]
        public DateTime StartDate { get; set; }

        [JsonProperty("fechaFin")]
        public DateTime EndDate { get; set; }

        [JsonProperty("tipoActividadId")]
        public string ActivityType { get; set; }

        [JsonProperty("altura")]
        public int MachineId { get; set; }

        public long LastCheckTicks { get; set; }
    }
}
