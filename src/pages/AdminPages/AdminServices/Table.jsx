import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Popconfirm,
    Select,
    Radio,
    Row,
    Col,
} from "antd";
import {
    CheckCircleOutlined, CloseCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import {FaRegEdit} from "react-icons/fa";
import {MdDeleteForever} from "react-icons/md";
import {
    useGetAllCategoryQuery,
    useGetAllClinicQuery,
    useGetAllDoctorsQuery,
    useGetAllServiceQuery
} from "../../../services/userApi.jsx";

const ServicesTable = () => {

    const {data:getAllService} = useGetAllServiceQuery()
    const services = getAllService?.data
    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Şəkil",
            dataIndex: "cardImageUrl",
            key: "cardImageUrl",
            render: (cardImageUrl) => {
                if (!cardImageUrl || cardImageUrl.length === 0) return <span>No Image</span>;
                return (
                    <img
                        src={ cardImageUrl}
                        alt="Şəkil"
                        style={{width: 50, height: 50, borderRadius: '5px', objectFit: "cover"}}
                    />
                );
            },
        },
        {
            title: "Kateqoriya adı",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Açıqlama",
            dataIndex: "description",
            key: "description",
        },
        // {
        //     title: "Xidmətlər",
        //     dataIndex: "services",
        //     key: "services",
        // },
        // {
        //     title: "Ölkə",
        //     dataIndex: "countryNames",
        //     key: "countryNames",
        //     render: (countryNames) =>
        //         Array.isArray(countryNames)
        //             ? countryNames.join(" , ")
        //             : countryNames,
        // },

        {
            title: "Əməliyyatlar",
            key: "actions",
            render: (text, record) => (
                <div style={{display: "flex", gap: "8px", justifyContent: "center"}}>
                    <Button type="primary" onClick={() => showEditModal(record)}>
                        <FaRegEdit/>
                    </Button>
                    <Popconfirm
                        title="Silmək istədiyinizə əminsiniz?"
                        onConfirm={() => (record.id)}
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <Button type="default" danger>
                            <MdDeleteForever/>
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => (true)} style={{marginBottom: 16}}>
                +
            </Button>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={services}
                pagination={{pageSize: 6}}
            />

            {/*<Modal*/}
            {/*    title="Yeni Tur Əlavə Et"*/}
            {/*    visible={isModalVisible}*/}
            {/*    onCancel={handleCancel}*/}
            {/*    footer={null}*/}
            {/*    width={1000}*/}
            {/*>*/}
            {/*    <Form form={form} layout="vertical" onFinish={handleAddTours}>*/}
            {/*        <Row gutter={16}>*/}
            {/*            /!* Sol Sütun *!/*/}
            {/*            <Col span={12}>*/}
            {/*                <Form.Item*/}
            {/*                    name="title"*/}
            {/*                    label="Tur Adı (AZ)"*/}
            {/*                    rules={[{required: true, message: "Tur adını daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Tur adını daxil edin"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item*/}
            {/*                    name="titleEng"*/}
            {/*                    label="Tur Adı (EN)"*/}
            {/*                    rules={[{required: true, message: "Tur adını daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Tur adını daxil edin (Eng)"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item*/}
            {/*                    name="titleRu"*/}
            {/*                    label="Tur Adı (RU)"*/}
            {/*                    rules={[{required: true, message: "Tur adını daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Tur adını daxil edin (Ru)"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item*/}
            {/*                    name="description"*/}
            {/*                    label="Açıqlama (AZ)"*/}
            {/*                    rules={[{required: true, message: "Açıqlama daxil edin!"}]}>*/}
            {/*                    <Input.TextArea placeholder="Açıqlama daxil edin"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item*/}
            {/*                    name="descriptionEng"*/}
            {/*                    label="Açıqlama (EN)"*/}
            {/*                    rules={[{required: true, message: "Açıqlama daxil edin!"}]}>*/}
            {/*                    <Input.TextArea placeholder="Açıqlama daxil edin (Eng)"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item*/}
            {/*                    name="descriptionRu"*/}
            {/*                    label="Açıqlama (RU)"*/}
            {/*                    rules={[{required: true, message: "Açıqlama daxil edin!"}]}>*/}
            {/*                    <Input.TextArea placeholder="Açıqlama daxil edin (Ru)"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item label="Index Şəkil">*/}
            {/*                    <Upload*/}
            {/*                        name="cardImage"*/}
            {/*                        listType="picture-card"*/}
            {/*                        fileList={cardFileList}*/}
            {/*                        beforeUpload={() => false}*/}
            {/*                        onChange={({fileList: newFileList}) => setCardFileList(newFileList)}*/}
            {/*                        onRemove={(file) => setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))}*/}
            {/*                    >*/}
            {/*                        {cardFileList.length < 1 && (*/}
            {/*                            <div>*/}
            {/*                                <PlusOutlined/>*/}
            {/*                                <div style={{marginTop: 8}}>Şəkil əlavə et</div>*/}
            {/*                            </div>*/}
            {/*                        )}*/}
            {/*                    </Upload>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item label="Tur Şəkilləri">*/}
            {/*                    <Upload {...uploadProps}>*/}
            {/*                        {tourFileList.length < 5 && (*/}
            {/*                            <div>*/}
            {/*                                <PlusOutlined/>*/}
            {/*                                <div style={{marginTop: 8}}>Şəkil əlavə et</div>*/}
            {/*                            </div>*/}
            {/*                        )}*/}
            {/*                    </Upload>*/}
            {/*                </Form.Item>*/}
            {/*            </Col>*/}

            {/*            /!* Sağ Sütun *!/*/}
            {/*            <Col span={12}>*/}
            {/*                <Form.Item*/}
            {/*                    name="startDate"*/}
            {/*                    label="Başlama Tarixi"*/}
            {/*                    rules={[{required: true, message: "Başlama tarixini daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Başlama tarixi seçin"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item*/}
            {/*                    name="endDate"*/}
            {/*                    label="Bitmə Tarixi"*/}
            {/*                    rules={[{required: true, message: "Bitmə tarixini daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Bitmə tarixi seçin"/>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item name="isOvernighStay" label="Gecələmə">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item name="isTicket" label="Bilet">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item name="isInsurance" label="Sığorta">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item name="isVisa" label="Viza">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item name="isPopular" label="Populyarlıq">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item name="countryIds" label="Ölkələr">*/}
            {/*                    <Select*/}
            {/*                        mode="multiple"*/}
            {/*                        placeholder="Ölkə seçin"*/}
            {/*                        onChange={handleCountryChange}*/}
            {/*                    >*/}
            {/*                        {countries && countries.map((country) => (*/}
            {/*                            <Select.Option key={country.id} value={country.id}>*/}
            {/*                                {country.name}*/}
            {/*                            </Select.Option>*/}
            {/*                        ))}*/}
            {/*                    </Select>*/}
            {/*                </Form.Item>*/}

            {/*                <Form.Item name="cityIds" label="Şəhərlər">*/}
            {/*                    <Select*/}
            {/*                        mode="multiple"*/}
            {/*                        placeholder="Şəhər seçin"*/}
            {/*                        disabled={!selectedCountry || selectedCountry.length === 0}*/}
            {/*                        dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}*/}
            {/*                    >*/}
            {/*                        {getCityOptionsForSelectedCountries()?.map((city) => (*/}
            {/*                            <Select.Option key={city.id} value={city.id}>*/}
            {/*                                {city.name}*/}
            {/*                            </Select.Option>*/}
            {/*                        ))}*/}
            {/*                    </Select>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="tourType" label="Tur Növü">*/}
            {/*                    <Select placeholder="Tur növünü seçin">*/}
            {/*                        <Select.Option value="incomming">Ölkədaxili</Select.Option>*/}
            {/*                        <Select.Option value="outgoing">Ölkəxarici</Select.Option>*/}
            {/*                    </Select>*/}
            {/*                </Form.Item>*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*        <Form.Item style={{textAlign: "right"}}>*/}
            {/*            <Button type="primary" htmlType="submit" style={{marginRight: 8}}>*/}
            {/*                Əlavə Et*/}
            {/*            </Button>*/}
            {/*            <Button onClick={handleCancel}>İmtina Et</Button>*/}
            {/*        </Form.Item>*/}
            {/*    </Form>*/}
            {/*</Modal>*/}

            {/*/!* Edit Tour Modal *!/*/}
            {/*<Modal*/}
            {/*    title="Tur Redaktə Et"*/}
            {/*    visible={isEditModalVisible}*/}
            {/*    onCancel={handleEditCancel}*/}
            {/*    footer={null}*/}
            {/*    width={1000}*/}
            {/*>*/}
            {/*    <Form form={editForm} layout="vertical" onFinish={handleEditTour}>*/}
            {/*        <Row gutter={16}>*/}
            {/*            /!* Sol Sütun *!/*/}
            {/*            <Col span={12}>*/}
            {/*                <Form.Item*/}
            {/*                    name="title"*/}
            {/*                    label="Tur Adı (AZ)"*/}
            {/*                    rules={[{required: true, message: "Tur adını daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Tur adını daxil edin"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item*/}
            {/*                    name="titleEng"*/}
            {/*                    label="Tur Adı (EN)"*/}
            {/*                    rules={[{required: true, message: "Tur adını daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Tur adını daxil edin (Eng)"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item*/}
            {/*                    name="titleRu"*/}
            {/*                    label="Tur Adı (RU)"*/}
            {/*                    rules={[{required: true, message: "Tur adını daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Tur adını daxil edin (Ru)"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item*/}
            {/*                    name="description"*/}
            {/*                    label="Açıqlama (AZ)"*/}
            {/*                    rules={[{required: true, message: "Açıqlama daxil edin!"}]}>*/}
            {/*                    <Input.TextArea placeholder="Açıqlama daxil edin"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item*/}
            {/*                    name="descriptionEng"*/}
            {/*                    label="Açıqlama (EN)"*/}
            {/*                    rules={[{required: true, message: "Açıqlama daxil edin!"}]}>*/}
            {/*                    <Input.TextArea placeholder="Açıqlama daxil edin (Eng)"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item*/}
            {/*                    name="descriptionRu"*/}
            {/*                    label="Açıqlama (RU)"*/}
            {/*                    rules={[{required: true, message: "Açıqlama daxil edin!"}]}>*/}
            {/*                    <Input.TextArea placeholder="Açıqlama daxil edin (Ru)"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item label="Index Şəkil">*/}
            {/*                    <Upload*/}
            {/*                        name="cardImage"*/}
            {/*                        listType="picture-card"*/}
            {/*                        fileList={cardFileList}*/}
            {/*                        beforeUpload={() => false}*/}
            {/*                        onChange={({fileList: newFileList}) => setCardFileList(newFileList)}*/}
            {/*                        onRemove={(file) => setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))}*/}
            {/*                    >*/}
            {/*                        {cardFileList.length < 1 && (*/}
            {/*                            <div>*/}
            {/*                                <PlusOutlined/>*/}
            {/*                                <div style={{marginTop: 8}}>Şəkil əlavə et</div>*/}
            {/*                            </div>*/}
            {/*                        )}*/}
            {/*                    </Upload>*/}
            {/*                </Form.Item>*/}
            {/*            </Col>*/}

            {/*            /!* Sağ Sütun *!/*/}
            {/*            <Col span={12}>*/}
            {/*                <Form.Item label="Tur Şəkilləri">*/}
            {/*                    <Upload*/}
            {/*                        name="tourImages"*/}
            {/*                        listType="picture-card"*/}
            {/*                        multiple*/}
            {/*                        fileList={tourFileList}*/}
            {/*                        beforeUpload={() => false}*/}
            {/*                        onChange={({fileList: newFileList}) => setTourFileList(newFileList)}*/}
            {/*                        onRemove={(file) => setTourFileList(tourFileList.filter((f) => f.uid !== file.uid))}*/}
            {/*                    >*/}
            {/*                        {tourFileList.length < 5 && (*/}
            {/*                            <div>*/}
            {/*                                <PlusOutlined/>*/}
            {/*                                <div style={{marginTop: 8}}>Şəkil əlavə et</div>*/}
            {/*                            </div>*/}
            {/*                        )}*/}
            {/*                    </Upload>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item*/}
            {/*                    name="startDate"*/}
            {/*                    label="Başlama Tarixi"*/}
            {/*                    rules={[{required: true, message: "Başlama tarixini daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Başlama tarixi seçin"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item*/}
            {/*                    name="endDate"*/}
            {/*                    label="Bitmə Tarixi"*/}
            {/*                    rules={[{required: true, message: "Bitmə tarixini daxil edin!"}]}>*/}
            {/*                    <Input placeholder="Bitmə tarixi seçin"/>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="isOvernighStay" label="Gecələmə">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="isTicket" label="Bilet">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="isInsurance" label="Sığorta">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="isVisa" label="Viza">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="isPopular" label="Populyarlıq">*/}
            {/*                    <Radio.Group>*/}
            {/*                        <Radio value={true}>Var</Radio>*/}
            {/*                        <Radio value={false}>Yox</Radio>*/}
            {/*                    </Radio.Group>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="tourType" label="Tur Növü">*/}
            {/*                    <Select placeholder="Tur növünü seçin">*/}
            {/*                        <Select.Option value="incomming">Incomming</Select.Option>*/}
            {/*                        <Select.Option value="outgoing">Outgoing</Select.Option>*/}
            {/*                    </Select>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="countryIds" label="Ölkələr">*/}
            {/*                    <Select*/}
            {/*                        mode="multiple"*/}
            {/*                        placeholder="Ölkə seçin"*/}
            {/*                        onChange={handleCountryChange}*/}
            {/*                    >*/}
            {/*                        {countries && countries.map((country) => (*/}
            {/*                            <Select.Option key={country.id} value={country.id}>*/}
            {/*                                {country.name}*/}
            {/*                            </Select.Option>*/}
            {/*                        ))}*/}
            {/*                    </Select>*/}
            {/*                </Form.Item>*/}
            {/*                <Form.Item name="cityIds" label="Şəhərlər">*/}
            {/*                    <Select*/}
            {/*                        mode="multiple"*/}
            {/*                        placeholder="Şəhər seçin"*/}
            {/*                        disabled={!selectedCountry || selectedCountry.length === 0}*/}
            {/*                    >*/}
            {/*                        {getCityOptionsForSelectedCountries()?.map((city) => (*/}
            {/*                            <Select.Option key={city.id} value={city.id}>*/}
            {/*                                {city.name}*/}
            {/*                            </Select.Option>*/}
            {/*                        ))}*/}
            {/*                    </Select>*/}
            {/*                </Form.Item>*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*        <Form.Item style={{textAlign: "right"}}>*/}
            {/*            <Button type="primary" htmlType="submit" style={{marginRight: 8}}>*/}
            {/*                Düzəliş Et*/}
            {/*            </Button>*/}
            {/*            <Button onClick={handleEditCancel}>İmtina Et</Button>*/}
            {/*        </Form.Item>*/}
            {/*    </Form>*/}
            {/*</Modal>*/}
        </div>
    );
};

export default ServicesTable