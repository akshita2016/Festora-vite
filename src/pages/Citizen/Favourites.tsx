
import "./Favourites.css";
import { useEffect, useState } from "react";
import axios from "axios";




interface Vendor {
      _id?: string;
  emailid: string;
  name: string;
  business: string;
  contact: string;
  area: string;
  address: string;
  city: string;
  estd: string;
  selcate: string;
  website?: string;
  shoppicurl?: string;
  
}
type FavoriteRecord = {
  vendorId: Vendor | null;
};
function FavouriteCard({
  vendor,
  onRemove,
}: {
  vendor: Vendor;
  onRemove: (vendor: Vendor) => void;
}) {
  return (
    <div className="fav-card">
      <div className="fav-card__img">
        {vendor.shoppicurl ? (
          <img src={vendor.shoppicurl} alt={vendor.business} />
        ) : (
          <div className="fav-card__img-placeholder">🏢</div>
        )}

        <button
          type="button"
          className="fav-card__heart liked"
          onClick={() => onRemove(vendor)}
        >
          ♥
        </button>
      </div>

      <div className="fav-card__body">
        <p className="fav-card__biz">{vendor.business}</p>
        <p className="fav-card__name">{vendor.name}</p>

        <p className="fav-card__location">
          📍 {vendor.area}, {vendor.city}
        </p>

      

        <div className="fav-card__actions">
          <a href={`tel:${vendor.contact}`} className="fav-card__link-btn">
            📞 {vendor.contact}
          </a>

          <button
            type="button"
            className="fav-card__remove-btn"
            onClick={() => onRemove(vendor)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Favourites(){
  const [favourites, setFavourites] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

 

  // Fetch favourites
useEffect(() => {
  const fetchFavourites = async () => {
    
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
    `${import.meta.env.VITE_API_URL}206/favorites/fetch`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Favourites API response:", res.data);
console.log("Vendor details:", res.data.favorites);

      if (res.data.status) {
        setFavourites(res.data.favorites);
      }
    } catch (error) {
      console.log(error);
      setMessage("Could not fetch favourites.");
    } finally {
      setLoading(false);
    }
  };

  fetchFavourites();
}, []);

  
// Remove one favourite
const onRemove = async (vendor: Vendor) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/favorites/remove`,
      {
        vendorEmail: vendor.emailid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.status) {
      setFavourites((prev) =>
        prev.filter((item) => item.emailid !== vendor.emailid)
      );
    }
  } catch (error) {
    console.log(error);
    setMessage("Could not remove favourite.");
  }
};
  // Remove all favourites
const onClearAll = async () => {
  try {
    const token = localStorage.getItem("token");

    for (const vendor of favourites) {
      await axios.post(
   `${import.meta.env.VITE_API_URL}/favorites/remove`,
        {
          vendorEmail: vendor.emailid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    setFavourites([]);
  } catch (error) {
    console.log(error);
    setMessage("Could not clear favourites.");
  }
};

  return (
    <div className="fav-root">


      <main className="fav-content">
        <div className="fav-content__header">
          <div>
            <h1 className="fav-content__title">
              My <em>Favourites</em>
            </h1>
            <p className="fav-content__subtitle">
              {favourites.length} vendors saved
            </p>
          </div>

          {favourites.length > 0 && (
            <button
              type="button"
              className="fav-clear-btn"
              onClick={onClearAll}
            >
              Clear All
            </button>
          )}
        </div>

        {message && <p>{message}</p>}

        {loading ? (
          <p>Loading favourites...</p>
        ) : favourites.length > 0 ? (
          <div className="fav-grid">
            {favourites.map((vendor) => (
              <FavouriteCard
                key={vendor.emailid}
                vendor={vendor}
                onRemove={onRemove}
              />
            ))}
          </div>
        ) : (
          <div className="fav-empty">
            <p className="fav-empty__icon">🤍</p>
            <p className="fav-empty__title">No favourites yet</p>
            <p className="fav-empty__sub">
              Browse vendors and click the heart to save them.
            </p>

          </div>
        )}
      </main>
    </div>
  );
}
