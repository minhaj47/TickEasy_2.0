import { Star } from "lucide-react";

const GallerySection = () => {
  const gradients = [
    "from-violet-400 to-indigo-400",
    "from-emerald-400 to-teal-400",
    "from-rose-400 to-pink-400",
    "from-amber-400 to-orange-400",
    "from-cyan-400 to-blue-400",
    "from-purple-400 to-violet-400",
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-violet-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
            <Star className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-semibold text-violet-200">
              SUCCESS STORIES
            </span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Flagship Events
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              In Review
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Witness the magic of exceptional events powered by our innovative
            ticketing solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <div key={item} className="group relative aspect-square">
              <div
                className={`w-full h-full bg-gradient-to-br ${
                  gradients[item % gradients.length]
                } rounded-2xl hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl`}
              >
                <div className="absolute inset-0 bg-black/20 rounded-2xl group-hover:bg-black/10 transition-colors"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
