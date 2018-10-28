using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MultiFaceRec.Domain
{
    public class Usuario
    {
        [JsonProperty("altura")]
        public int? Altura { get; set; }

        [JsonProperty("peso")]
        public int? Peso { get; set; }

        [JsonProperty("sexo")]
        public string Sexo { get; set; }

        [JsonProperty("edad")]
        public int? Edad { get; set; }

        [JsonProperty("foto")]
        public string Foto { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("deviceId")]
        public int? DeviceId { get; set; }

        [JsonProperty("gimnasioId")]
        public int? GimnasioId { get; set; }

        [JsonProperty("id")]
        public int? Id { get; set; }
    }
}
