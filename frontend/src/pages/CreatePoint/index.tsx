import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import api from '../../services/api';
import './styles.css';
import logo from '../assets/logo.svg';
import Dropzone from '../../components/Dropzone';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const history = useHistory();

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const [selectedFile, setSelectedFile] = useState<File>();

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    -23.1848224,
    -45.8868207,
  ]);

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    number: '',
    neighborhood: '',
  });

  // getting items from API
  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  // getting UF from IBGE API
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  // getting city from IBGE API
  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  // setting initial position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  });

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>): void {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>): void {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent): void {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number): void {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    const { name, email, whatsapp, address, number, neighborhood } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const itemsId = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('address', address);
    data.append('number', number);
    data.append('neighborhood', neighborhood);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', itemsId.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('points', data);

    alert('Ponto de coleta criado');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <div className="content">
        <header>
          <Link to="/">
            <img src={logo} alt="Ecoleta" />
          </Link>
          <Link to="/">
            <FiArrowLeft />
            Voltar para Home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>
            Cadastro do
            <br /> ponto de coleta
          </h1>

          <Dropzone onFileUploaded={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados da entidade</h2>
              <span>Insira os dados da entidade</span>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                placeholder="Digite aqui"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  placeholder="Digite aqui"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  maxLength={11}
                  minLength={10}
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <legend className="addressTitle">
              <h2>Endereço</h2>
              <span>Insira os dados do endereço</span>
            </legend>

            <div className="field">
              <label htmlFor="address">Logradouro</label>
              <input
                type="text"
                placeholder="Digite aqui a rua/avenida/travessa"
                name="address"
                id="address"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="number">Número</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  name="number"
                  id="number"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="neighborhood">Bairro</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  name="neighborhood"
                  id="neighborhood"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">UF</label>
                <select
                  name="uf"
                  id="uf"
                  value={selectedUf}
                  onChange={handleSelectUf}
                >
                  <option value="0">Selecione</option>
                  {ufs.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  value={selectedCity}
                  onChange={handleSelectCity}
                >
                  <option value="0">Selecione</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Localização</h2>

              <span>Selecione um local no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition} />
            </Map>
          </fieldset>
          <fieldset>
            <legend>
              <h2>Itens de coleta</h2>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>
            <ul className="items-grid">
              {items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>
          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoint;
