import {useState} from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Popconfirm,
    Row,
    Col,
    Select,
    message,
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {FaRegEdit} from "react-icons/fa";
import {MdDeleteForever} from "react-icons/md";
import {
    useGetAllServiceQuery,
    useGetAllCategoryQuery,
    useGetAllClinicQuery,
    usePostServiceMutation,
    usePutServiceMutation,
    useDeleteServiceMutation,
} from "../../../services/userApi.jsx";
import {SERVICE_CARD_IMAGES, SERVICE_IMAGES} from "../../../contants.js";

const ServicesTable = () => {
    const {data: getAllService, refetch: refetchServices} = useGetAllServiceQuery();
    const {data: getAllCategory} = useGetAllCategoryQuery();
    const {data: getAllClinic} = useGetAllClinicQuery();
    const services = getAllService?.data || [];
    const categories = getAllCategory?.data || [];
    const clinics = getAllClinic?.data || [];

    const [postService] = usePostServiceMutation();
    const [putService] = usePutServiceMutation();
    const [deleteService] = useDeleteServiceMutation();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingService, setEditingService] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);
    const [serviceImagesFileList, setServiceImagesFileList] = useState([]);

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setServiceImagesFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingService(record);
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            categoryId: record.categoryId,
            optionNames: record.options?.map(opt => opt.name) || [],
            clinicServices: record.clinicIds || [],
            deleteOptionNames: [],
            deleteServiceImages: [],
            deleteClinicServices: [],
        });

        // Populate service card image
        setCardFileList(
            record.serviceCardImage
                ? [{
                    uid: "-1",
                    name: record.serviceCardImage,
                    status: "done",
                    url: SERVICE_CARD_IMAGES + record.serviceCardImage,
                }]
                : []
        );

        // Populate service images
        setServiceImagesFileList(
            record.serviceImages?.length > 0
                ? record.serviceImages.map((img, index) => ({
                    uid: `-${index + 1}`,
                    name: img,
                    status: "done",
                    url: SERVICE_IMAGES + img,
                }))
                : []
        );

        setIsEditModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingService(null);
    };

    // Form submission handlers
    const handleAddService = async (values) => {
        const { clinicServices, categoryId, optionNames, ...rest } = values;

        const formData = new FormData();
        formData.append("name", rest.name);
        formData.append("nameEng", rest.nameEng);
        formData.append("nameRu", rest.nameRu);
        formData.append("description", rest.description);
        formData.append("descriptionEng", rest.descriptionEng);
        formData.append("descriptionRu", rest.descriptionRu);
        formData.append("categoryId", categoryId);
        if (optionNames) {
            optionNames.forEach((option, index) => {
                formData.append(`optionNames[${index}]`, option);
            });
        }
        if (cardFileList[0]?.originFileObj) {
            formData.append("serviceCardImage", cardFileList[0].originFileObj);
        }
        serviceImagesFileList.forEach((file) => {
            if (file.originFileObj) {
                formData.append("serviceImages", file.originFileObj);
            }
        });

        try {
            const serviceResponse = await postService(formData).unwrap();
            const serviceId = serviceResponse.data.id;

            // Send clinic associations to a separate endpoint
            if (clinicServices && clinicServices.length > 0) {
                for (const clinicId of clinicServices) {
                    const clinicPayload = { serviceId, clinicId };
                    // Replace with actual API call, e.g., postServiceClinic(clinicPayload)
                    await fetch("/api/service-clinics", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(clinicPayload),
                    });
                }
            }

            message.success("Xidmət uğurla əlavə edildi!");
            setIsAddModalVisible(false);
            form.resetFields();
            setCardFileList([]);
            setServiceImagesFileList([]);
            refetchServices();
        } catch (error) {
            console.error("Error adding service:", error);
            message.error("Xidmət əlavə edilərkən xəta baş verdi!");
        }
    };

    const handleEditService = async (values) => {
        const {
            clinicServices,
            deleteClinicServices,
            categoryId,
            optionNames,
            deleteOptionNames,
            deleteServiceImages,
            ...rest
        } = values;

        // Compute deleted items based on current state vs. original data
        const computedDeleteServiceImages = editingService.serviceImages?.filter(
            img => !serviceImagesFileList.some(file => file.name === img)
        ) || [];
        const computedDeleteOptionNames = editingService.options
            ?.filter(opt => !optionNames.includes(opt.name))
            .map(opt => opt.name) || [];
        const computedDeleteClinicServices = editingService.clinicIds
            ?.filter(clinicId => !clinicServices.includes(clinicId)) || [];

        const formData = new FormData();
        formData.append("id", editingService.id);
        formData.append("name", rest.name);
        formData.append("nameEng", rest.nameEng);
        formData.append("nameRu", rest.nameRu);
        formData.append("description", rest.description);
        formData.append("descriptionEng", rest.descriptionEng);
        formData.append("descriptionRu", rest.descriptionRu);
        formData.append("categoryId", categoryId);

        if (optionNames && optionNames.length > 0) {
            optionNames.forEach((option, index) => {
                formData.append(`optionNames[${index}]`, option);
            });
        }
        if (computedDeleteOptionNames.length > 0) {
            computedDeleteOptionNames.forEach((option, index) => {
                formData.append(`deleteOptionNames[${index}]`, option);
            });
        }
        if (cardFileList[0]?.originFileObj) {
            formData.append("serviceCardImage", cardFileList[0].originFileObj);
        }
        serviceImagesFileList.forEach((file) => {
            if (file.originFileObj) {
                formData.append("serviceImages", file.originFileObj);
            }
        });
        if (computedDeleteServiceImages.length > 0) {
            computedDeleteServiceImages.forEach((image, index) => {
                formData.append(`deleteServiceImages[${index}]`, image);
            });
        }
        if (clinicServices && clinicServices.length > 0) {
            clinicServices.forEach((clinicId, index) => {
                formData.append(`clinicServices[${index}]`, clinicId);
            });
        }
        if (computedDeleteClinicServices.length > 0) {
            computedDeleteClinicServices.forEach((clinicId, index) => {
                formData.append(`deleteClinicServices[${index}]`, clinicId);
            });
        }

        // Log FormData for debugging
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? value.name : value);
        }

        try {
            await putService({id: editingService.id, data: formData}).unwrap();
            message.success("Xidmət uğurla yeniləndi!");
            setIsEditModalVisible(false);
            editForm.resetFields();
            setCardFileList([]);
            setServiceImagesFileList([]);
            setEditingService(null);
            refetchServices();
        } catch (error) {
            console.error("Error updating service:", error);
            message.error("Xidmət yenilənərkən xəta baş verdi!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteService(id).unwrap();
            message.success("Xidmət uğurla silindi!");
            refetchServices();
        } catch (error) {
            console.error("Error deleting service:", error);
            message.error("Xidmət silinərkən xəta baş verdi!");
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Şəkil",
            dataIndex: "serviceCardImage",
            key: "serviceCardImage",
            render: (serviceCardImage) => {
                if (!serviceCardImage) return <span>No Image</span>;
                return (
                    <img
                        src={SERVICE_CARD_IMAGES + serviceCardImage}
                        alt="Şəkil"
                        style={{width: 50, height: 50, borderRadius: "5px", objectFit: "cover"}}
                    />
                );
            },
        },
        {
            title: "Xidmət adı",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Açıqlama",
            dataIndex: "description",
            key: "description",
        },
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
                        onConfirm={() => handleDelete(record.id)}
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

    const expandedRowRender = (record) => {
        const categoryName = categories.find((category) => category.id === record.categoryId)?.name || "Bilinməyən Kateqoriya";

        const optionColumns = [
            {
                title: "Seçim Adı",
                dataIndex: "name",
                key: "name",
            },
        ];

        return (
            <div>
                <h4>Əlavə Məlumat</h4>
                <Row gutter={16}>
                    <Col span={12}>
                        <p><strong>Ad (EN):</strong> {record.nameEng}</p>
                        <p><strong>Ad (RU):</strong> {record.nameRu}</p>
                        <p><strong>Açıqlama (EN):</strong> {record.descriptionEng}</p>
                        <p><strong>Açıqlama (RU):</strong> {record.descriptionRu}</p>
                    </Col>
                    <Col span={12}>
                        <p><strong>Kateqoriya:</strong> {categoryName}</p>
                        <p>
                            <strong>Xidmət Şəkilləri:</strong>{" "}
                            {record.serviceImages.length > 0
                                ? record.serviceImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={SERVICE_IMAGES + img}
                                        alt={`Xidmət Şəkli ${index + 1}`}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            marginRight: 8,
                                            borderRadius: "5px",
                                            objectFit: "cover"
                                        }}
                                    />
                                ))
                                : "Şəkil yoxdur"}
                        </p>
                        <p>
                            <strong>Klinikalar:</strong>{" "}
                            {record.clinicIds?.length > 0
                                ? record.clinicIds.map((clinicId) => {
                                    const clinic = clinics.find(c => c.id === clinicId);
                                    return clinic ? clinic.name : clinicId;
                                }).join(", ")
                                : "Klinika yoxdur"}
                        </p>
                    </Col>
                </Row>
                <h4>Seçimlər</h4>
                <Table
                    columns={optionColumns}
                    dataSource={record.options}
                    pagination={false}
                    rowKey="id"
                />
            </div>
        );
    };

    return (
        <div className="p-4">
            <Button
                type="primary"
                onClick={showAddModal}
                className="mb-4 bg-blue-500 hover:bg-blue-600"
            >
                +
            </Button>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={services}
                pagination={{pageSize: 6}}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                        record.nameEng ||
                        record.nameRu ||
                        record.descriptionEng ||
                        record.descriptionRu ||
                        record.categoryId ||
                        record.serviceImages.length > 0 ||
                        record.options.length > 0 ||
                        record.clinicIds.length > 0,
                }}
            />

            {/* Add Service Modal */}
            <Modal
                title="Yeni Xidmət Əlavə Et"
                open={isAddModalVisible}
                onCancel={handleAddCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={form} layout="vertical" onFinish={handleAddService}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Xidmət Adı (AZ)"
                                rules={[{required: true, message: "Ad daxil edin!"}]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md"/>
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Xidmət Adı (EN)"
                                rules={[{required: true, message: "Ad daxil edin!"}]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md"/>
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Xidmət Adı (RU)"
                                rules={[{required: true, message: "Ad daxil edin!"}]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md"/>
                            </Form.Item>
                            <Form.Item
                                name="categoryId"
                                label="Kateqoriya"
                                rules={[{required: true, message: "Kateqoriya seçin!"}]}
                            >
                                <Select placeholder="Kateqoriya seçin" className="rounded-md">
                                    {categories.map((category) => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="clinicServices"
                                label="Klinikalar"
                                rules={[{required: true, message: "Ən azı bir klinika seçin!"}]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Klinikaları seçin"
                                    className="rounded-md"
                                    optionFilterProp="children"
                                    showSearch
                                >
                                    {clinics.map((clinic) => (
                                        <Select.Option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{required: true, message: "Açıqlama daxil edin!"}]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{required: true, message: "Açıqlama daxil edin!"}]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{required: true, message: "Açıqlama daxil edin!"}]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="optionNames"
                                label="Seçim Adları"
                                rules={[{required: false}]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Seçim adlarını daxil edin (məsələn, Standart, Premium)"
                                    className="rounded-md"
                                    tokenSeparators={[","]}
                                />
                            </Form.Item>
                            <Form.Item label="Xidmət Kart Şəkli">
                                <Upload
                                    name="serviceCardImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({fileList}) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined/>
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Xidmət Şəkilləri">
                                <Upload
                                    name="serviceImages"
                                    listType="picture-card"
                                    fileList={serviceImagesFileList}
                                    beforeUpload={() => false}
                                    onChange={({fileList}) => setServiceImagesFileList(fileList)}
                                    onRemove={(file) =>
                                        setServiceImagesFileList(
                                            serviceImagesFileList.filter((f) => f.uid !== file.uid)
                                        )
                                    }
                                    className="rounded-md"
                                    multiple
                                >
                                    <div>
                                        <PlusOutlined/>
                                        <div className="mt-2">Şəkillər əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Əlavə Et
                        </Button>
                        <Button onClick={handleAddCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Service Modal */}
            <Modal
                title="Xidmət Redaktə Et"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditService}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Xidmət Adı (AZ)"
                                rules={[{required: true, message: "Ad daxil edin!"}]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md"/>
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Xidmət Adı (EN)"
                                rules={[{required: true, message: "Ad daxil edin!"}]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md"/>
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Xidmət Adı (RU)"
                                rules={[{required: true, message: "Ad daxil edin!"}]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md"/>
                            </Form.Item>
                            <Form.Item
                                name="categoryId"
                                label="Kateqoriya"
                                rules={[{required: true, message: "Kateqoriya seçin!"}]}
                            >
                                <Select
                                    placeholder="Kateqoriya seçin"
                                    className="rounded-md"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {categories.map((category) => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="clinicServices"
                                label="Klinikalar"
                                rules={[{required: true, message: "Ən azı bir klinika seçin!"}]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Klinikaları seçin"
                                    className="rounded-md"
                                    optionFilterProp="children"
                                    showSearch
                                    onChange={(value) => {
                                        // Calculate deleted clinics
                                        const deletedClinics = editingService?.clinicIds?.filter(
                                            id => !value.includes(id)
                                        ) || [];
                                        editForm.setFieldsValue({
                                            deleteClinicServices: deletedClinics
                                        });
                                    }}
                                >
                                    {clinics.map((clinic) => (
                                        <Select.Option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="deleteClinicServices"
                                rules={[{required: false}]}
                                noStyle
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{required: true, message: "Açıqlama daxil edin!"}]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{required: true, message: "Açıqlama daxil edin!"}]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{required: true, message: "Açıqlama daxil edin!"}]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="optionNames"
                                label="Seçim Adları"
                                rules={[{required: false}]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Seçim adlarını daxil edin (məsələn, Standart, Premium)"
                                    className="rounded-md"
                                    tokenSeparators={[","]}
                                    onChange={(value) => {
                                        // Calculate deleted options
                                        const deletedOptions = editingService?.options
                                            ?.filter(opt => !value.includes(opt.name))
                                            .map(opt => opt.name) || [];
                                        editForm.setFieldsValue({
                                            deleteOptionNames: deletedOptions
                                        });
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="deleteOptionNames"
                                rules={[{required: false}]}
                                noStyle
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                            <Form.Item label="Xidmət Kart Şəkli">
                                <Upload
                                    name="serviceCardImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({fileList}) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined/>
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Xidmət Şəkilləri">
                                <Upload
                                    name="serviceImages"
                                    listType="picture-card"
                                    fileList={serviceImagesFileList}
                                    beforeUpload={() => false}
                                    onChange={({fileList}) => {
                                        setServiceImagesFileList(fileList);
                                        // Calculate deleted images
                                        const deletedImages = editingService?.serviceImages?.filter(
                                            img => !fileList.some(file => file.name === img)
                                        ) || [];
                                        editForm.setFieldsValue({
                                            deleteServiceImages: deletedImages
                                        });
                                    }}
                                    className="rounded-md"
                                    multiple
                                >
                                    <div>
                                        <PlusOutlined/>
                                        <div className="mt-2">Şəkillər əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="deleteServiceImages"
                                rules={[{required: false}]}
                                noStyle
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Düzəliş Et
                        </Button>
                        <Button onClick={handleEditCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServicesTable;