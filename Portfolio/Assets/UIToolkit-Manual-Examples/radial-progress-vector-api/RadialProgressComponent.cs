using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;
using RadialProgressControl = MyUILibrary.RadialProgressVectorApi.RadialProgress;

namespace MyUILibrary.RadialProgressVectorApi
{
    [RequireComponent(typeof(UIDocument))]
    public class RadialProgressComponent : MonoBehaviour
    {

        RadialProgressControl m_RadialProgress;

        void Start()
        {
            var root = GetComponent<UIDocument>().rootVisualElement;

           m_RadialProgress = new RadialProgressControl() {
                style = {
                    position = Position.Absolute,
                    left = 20, top = 20, width = 200, height = 200
                }
            };

            root.Add(m_RadialProgress);
        }

        void Update()
        {
            m_RadialProgress.progress = ((Mathf.Sin(Time.time) + 1.0f) / 2.0f) * 60.0f + 10.0f;
        }
    }
}
